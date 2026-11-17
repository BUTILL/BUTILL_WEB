import type { DashboardData } from "../data/homeData";
import type { RawItem } from "../data/rawMaterials";
import type { ReportData } from "../data/reportData";
import type { Scenario, ScenarioKey } from "../data/simulation";
import { scenarioMeta } from "../data/simulation";
import type { TaxEvent, TaxKind } from "../data/taxCalendar";
import { detectRiskCauses } from "./riskRules";
import type { Analysis, Comparison, IngredientCosts, IngredientPrices, Runway, TaxSettings } from "./types";

const won = new Intl.NumberFormat("ko-KR");

export function todayKst(): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date());
  return ["year", "month", "day"].map((type) => parts.find((p) => p.type === type)?.value).join("-");
}

const yearMonth = (date: string) => date.slice(0, 7);
const monthLabel = (date: string) => `${Number(date.slice(0, 4))}년 ${Number(date.slice(5, 7))}월`;

// 현금흐름 분석 화면: 매출 = 수입, 식재료비 + 고정비 + 비정기 지출 = 지출
// forecastStart가 있으면(월별 실적 + 예측) 그 순번부터 예측, 없으면 이번 달부터 예측
export function toDashboard(analysis: Analysis, forecastStart?: number): DashboardData {
  const today = yearMonth(todayKst());
  return {
    startMonth: yearMonth(analysis.start_month),
    openingBalance: analysis.initial_cash,
    reserve: analysis.initial_cash - analysis.initial_available_cash,
    monthlyCashFlows: analysis.monthly.map((m, index) => ({
      month: yearMonth(m.month),
      income: m.sales,
      expense: m.ingredient_cost + m.fixed_cost + m.irregular_cost,
      isForecast: forecastStart == null ? yearMonth(m.month) >= today : index >= forecastStart,
    })),
  };
}

// 위험도가 높은 순서. 현금이 실제로 모자라는 위험을 비용 구조 원인보다 먼저 보여 준다
// 운영 적자는 지속 순현금유출(CASH-01) 규칙과 겹쳐 규칙 쪽으로 보여 준다
const riskOrder = ["CASH_SHORTAGE", "INITIAL_CASH_SHORTAGE", "RESERVE_NEEDED"];
const riskTitles: Record<string, string> = {
  INITIAL_CASH_SHORTAGE: "초기 자금 부족",
  RESERVE_NEEDED: "예비자금 사용",
  CASH_SHORTAGE: "현금 부족",
};

function endOfMonth(month: string): string {
  const [year, number] = month.split("-").map(Number);
  return new Date(Date.UTC(year, number, 0)).toISOString().slice(0, 10);
}

export type ReportPeriod = { startDate: string; endDate: string };

// 분석 전체 기간(시작 월 1일 ~ 마지막 월 말일)
export function analysisRange(analysis: Analysis): ReportPeriod {
  const last = analysis.monthly[analysis.monthly.length - 1];
  return { startDate: analysis.start_month, endDate: last ? endOfMonth(last.month.slice(0, 7)) : analysis.start_month };
}


// 분석 보고서 화면: 선택한 기간과 겹치는 달만 집계하고, 위험 원인을 3개 이상 만든다
// 월별 실적이 있을 때 앞으로의 흐름: 실적 + 예측 분석과 예측이 시작되는 순번
export type ReportOutlook = { analysis: Analysis; forecastStart: number };

export function toReport(analysis: Analysis, period?: ReportPeriod | null, outlook?: ReportOutlook | null): ReportData {
  const range = period ?? analysisRange(analysis);
  const rows = analysis.monthly.filter((m) => m.month <= range.endDate && endOfMonth(m.month.slice(0, 7)) >= range.startDate);
  const inPeriod = new Set(rows.map((m) => m.month));
  const runway = analysis.cash_runway;
  const days = (Date.parse(range.endDate) - Date.parse(range.startDate)) / 86_400_000;
  const nets = rows.map((m) => m.net_cashflow);
  const lowest = rows.reduce<number | null>((min, m) => (min === null || m.cash_balance < min ? m.cash_balance : min), null);

  // 1) 백엔드가 감지한 위험(현금 부족 등)을 종류별로 묶음
  const grouped = new Map<string, { months: string[]; amount: number; message: string }>();
  for (const risk of analysis.risks) {
    if (!inPeriod.has(risk.month) || !riskTitles[risk.code]) continue;
    const item = grouped.get(risk.code) ?? { months: [], amount: 0, message: risk.message };
    item.months.push(risk.month);
    item.amount += risk.amount;
    grouped.set(risk.code, item);
  }
  const detected = riskOrder.filter((code) => grouped.has(code)).map((code) => {
    const item = grouped.get(code)!;
    return {
      title: riskTitles[code],
      description: `${monthLabel(item.months[0])}${item.months.length > 1 ? ` 외 ${item.months.length - 1}개월` : ""} · ${item.message}`,
      expenseWon: item.amount,
    };
  });

  // 2) 웹 주요 위험원인 분석 규칙(riskRules.ts)으로 판정한 원인
  const causes = detectRiskCauses(analysis, rows).map(({ title, description, expenseWon }) => ({ title, description, expenseWon }));

  return {
    analysisDate: todayKst(),
    period: { startDate: range.startDate, endDate: range.endDate, weeks: Math.max(0, Math.floor(days / 7)) },
    ...(outlook ? outlookSummary(outlook) : {
      runwayMonths: runway.status === "no_shortage_in_period" ? analysis.months : runway.full_months_before_shortage,
      availableCashWon: analysis.initial_available_cash,
      projectedShortfallWon: lowest === null ? null : lowest < 0 ? lowest : rows[rows.length - 1].cash_balance,
    }),
    monthlyNetCashFlowWon: nets.length ? Math.round(nets.reduce((a, b) => a + b, 0) / nets.length) : null,
    risks: [...detected, ...causes],
  };
}

// 실적 기준 보고서: 지금 = 마지막 실적 달 말, 앞으로 = 예측 구간(가용자금 기준)
function outlookSummary({ analysis, forecastStart }: ReportOutlook) {
  const now = analysis.monthly[forecastStart - 1];
  const future = analysis.monthly.slice(forecastStart);
  const shortage = future.findIndex((m) => m.available_balance < 0);
  return {
    runwayMonths: shortage < 0 ? future.length : shortage,
    runwayIsMinimum: shortage < 0,
    availableCashWon: now ? now.available_balance : analysis.initial_available_cash,
    projectedShortfallWon: shortage >= 0 ? future[shortage].available_balance : future[future.length - 1]?.available_balance ?? null,
  };
}

export function runwayText(runway: Runway, months: number): string {
  if (runway.status === "no_shortage_in_period") return `${months}개월 이상`;
  return `약 ${runway.full_months_before_shortage ?? 0}개월`;
}

export function runwayNote(runway: Runway): string {
  const month = runway.first_shortage_month ?? runway.first_depletion_month;
  return month ? `${monthLabel(month)} 가용자금 부족 예상` : "분석 기간 내 부족 없음";
}

// 자금 시뮬레이션 화면: 시나리오별 월말 가용자금(만원)
export function toScenarios(comparison: Comparison): { scenarios: Scenario[]; months: string[] } {
  const analyses: Record<ScenarioKey, Analysis> = {
    basic: comparison.base,
    optimistic: comparison.scenarios[0].analysis,
    pessimistic: comparison.scenarios[1].analysis,
  };
  const scenarios = scenarioMeta.map((meta) => {
    const analysis = analyses[meta.key];
    return {
      ...meta,
      period: runwayText(analysis.available_runway, analysis.months),
      runwayNote: runwayNote(analysis.available_runway),
      fundsInTenThousands: analysis.monthly.map((m) => Math.round(m.available_balance / 10_000)),
    };
  });
  return { scenarios, months: comparison.base.monthly.map((m) => `${Number(m.month.slice(5, 7))}월`) };
}

function signedPercent(bps: number) {
  return `${bps > 0 ? "+" : bps < 0 ? "-" : ""}${(Math.abs(bps) / 100).toFixed(1)}%`;
}

// 원재료비 분석 화면: 매장에 등록한 원재료가 있으면 그 품목, 없으면 공통 품목
export function toRawItems(prices: IngredientPrices, costs: IngredientCosts | null): RawItem[] {
  const costByKey = new Map((costs?.items ?? []).map((item) => [item.price_key, item]));
  const keys = costByKey.size ? [...costByKey.keys()] : prices.items.filter((p) => p.groups.includes("common")).map((p) => p.key);
  return keys.flatMap((key) => {
    const price = prices.items.find((p) => p.key === key);
    if (!price?.latest || price.daily.length < 2) return [];
    const change = price.week_change;
    const bps = change?.change_bps ?? 0;
    const cost = costByKey.get(key);
    const impact = cost?.monthly_impact;
    return [{
      name: price.name,
      package: [price.kind_name, price.unit].filter(Boolean).join(" · "),
      previous: change?.base_price ?? price.latest.average_price,
      current: price.latest.average_price,
      change: signedPercent(bps),
      delta: change && change.change_amount !== 0
        ? `${change.change_amount > 0 ? "+" : "-"}${won.format(Math.abs(change.change_amount))}원`
        : "변동 없음",
      monthlyImpact: impact == null
        ? cost?.monthly_amount ? "변동 계산 불가" : "월 사용금액을 앱에서 입력하세요"
        : impact === 0 ? "월 지출 변동 없음" : `월 약 ${impact > 0 ? "+" : "-"}${won.format(Math.abs(impact))}원`,
      type: bps > 0 ? "up" : bps < 0 ? "down" : "steady",
      source: `KAMIS 서울 소매 평균 · ${price.latest.price_date.replaceAll("-", ".")} 기준${price.stale ? " (최신 수집 지연)" : ""}`,
      dailyPrices: price.daily.map((d) => d.average_price),
      dailyDates: price.daily.map((d) => d.price_date),
      bps,
    }];
  });
}

const taxKind = (code: string): TaxKind => code.startsWith("vat") ? "vat" : code === "withholding" ? "withholding" : "income";

const entityLabels: Record<string, string> = { individual: "개인사업자", corporation: "법인사업자", unregistered: "사업자 등록 전", unknown: "사업자 유형 미입력" };
const taxTypeLabels: Record<string, string> = { general: "일반과세자", simple: "간이과세자", unknown: "과세 유형 미입력" };

export function taxProfile(tax: TaxSettings): { title: string; tags: string[] } {
  const s = tax.settings;
  return {
    title: `${entityLabels[s.business_entity]} · ${taxTypeLabels[s.tax_type]}`,
    tags: [
      s.employees === "yes" ? "직원 있음" : s.employees === "no" ? "직원 없음" : "직원 채용 예정",
      s.filing_method === "accountant" ? "세무사 이용" : s.filing_method === "self" ? "직접 신고" : "신고 방법 미정",
    ],
  };
}

// 세금 관리 화면: 다가오는 1년 일정. 원천세는 다음 기한부터 매월 10일(주말이면 다음 평일)로 펼친다
export function toTaxEvents(tax: TaxSettings): TaxEvent[] {
  const events: TaxEvent[] = [];
  for (const item of tax.schedule) {
    const [year, month, day] = item.due_date.split("-").map(Number);
    if (item.code !== "withholding") {
      events.push({ year, month, day, kind: taxKind(item.code), name: item.title, detail: item.note ?? "기본 신고·납부 기한 기준", applies: "앱에 입력한 세금 설정 기준" });
      continue;
    }
    // 매월 10일 일정은 이번 달부터 12개월로 만든다(이번 달 기한이 지났어도 이번 달 일정에 올해 날짜로 보이게)
    const [thisYear, thisMonth] = todayKst().split("-").map(Number);
    for (let offset = 0; offset < 12; offset += 1) {
      const date = new Date(Date.UTC(thisYear, thisMonth - 1 + offset, 10));
      const weekday = date.getUTCDay();
      date.setUTCDate(date.getUTCDate() + (weekday === 6 ? 2 : weekday === 0 ? 1 : 0));
      events.push({
        year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate(), kind: "withholding",
        name: "원천세 신고·납부", detail: item.note ?? "직원 급여를 지급한 다음 달 10일", applies: "직원을 고용한 사업장",
      });
    }
  }
  return events;
}
