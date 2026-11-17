import type { Analysis, AnalysisMonth, Runway } from "./types";

// 백엔드 app/services/cashflow.py와 같은 기준으로 브라우저에서 월별 잔액을 계산한다(체험 모드 예시용).
export type MonthInput = { sales: number; ingredient_cost: number; fixed_cost: number; irregular_cost: number };

const addMonth = (start: string, offset: number) => {
  const [year, month] = start.split("-").map(Number);
  const index = year * 12 + month - 1 + offset;
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}-01`;
};

export function runwayOf(initial: number, balances: number[], start: string): Runway {
  const values = [initial, ...balances];
  const shortage = values.findIndex((v) => v < 0);
  const depletion = values.findIndex((v) => v <= 0);
  const monthAt = (index: number) => (index < 0 ? null : addMonth(start, Math.max(0, index - 1)));
  return {
    initial_balance: initial,
    first_depletion_month: monthAt(depletion),
    first_shortage_month: monthAt(shortage),
    shortage_amount: shortage < 0 ? 0 : -values[shortage],
    full_months_before_shortage: shortage < 0 ? null : Math.max(0, shortage - 1),
    status: shortage >= 0 ? "shortage" : depletion >= 0 ? "depleted" : "no_shortage_in_period",
  };
}

export function buildAnalysis(start: string, initialCash: number, reserve: number, months: MonthInput[]): Analysis {
  let cash = initialCash;
  const monthly: AnalysisMonth[] = [];
  const risks: Analysis["risks"] = [];
  months.forEach((m, index) => {
    const month = addMonth(start, index);
    const net = m.sales - m.ingredient_cost - m.fixed_cost - m.irregular_cost;
    cash += net;
    const available = cash - reserve;
    monthly.push({ month, ...m, net_cashflow: net, cash_balance: cash, available_balance: available });
    if (m.sales < m.ingredient_cost + m.fixed_cost) {
      risks.push({ code: "OPERATING_DEFICIT", month, amount: m.ingredient_cost + m.fixed_cost - m.sales, message: "월 매출보다 식재료비와 고정비가 많습니다." });
    }
    if (m.irregular_cost) {
      risks.push({ code: "IRREGULAR_OUTFLOW", month, amount: m.irregular_cost, message: "해당 월에 비정기 지출이 반영되었습니다." });
    }
    if (available < 0 && cash >= 0) {
      risks.push({ code: "RESERVE_NEEDED", month, amount: -available, message: "현금은 남아 있지만 예비자금을 제외한 가용자금은 부족합니다." });
    }
    if (cash < 0) {
      risks.push({ code: "CASH_SHORTAGE", month, amount: -cash, message: "예상 현금잔액이 음수입니다. 운영자금 보완이 필요합니다." });
    }
  });
  return {
    start_month: start,
    months: months.length,
    initial_cash: initialCash,
    initial_available_cash: initialCash - reserve,
    cash_runway: runwayOf(initialCash, monthly.map((m) => m.cash_balance), start),
    available_runway: runwayOf(initialCash - reserve, monthly.map((m) => m.available_balance), start),
    monthly,
    risks,
    warnings: [],
  };
}

// 월별 실적(지난 달 실제 매출·지출)
export type MonthlyRecord = MonthInput & { month: string };

export type RecordedAnalysis = {
  history: Analysis; // 실적 달만 (분석 보고서)
  combined: Analysis; // 실적 + 예측 (시나리오)
  forecastStart: number; // combined에서 예측이 시작되는 순번
};

export const FORECAST_MONTHS = 6;
const AVERAGE_MONTHS = 3;

const toInput = (m: MonthInput): MonthInput => ({
  sales: m.sales, ingredient_cost: m.ingredient_cost, fixed_cost: m.fixed_cost, irregular_cost: m.irregular_cost,
});
const net = (m: MonthInput) => m.sales - m.ingredient_cost - m.fixed_cost - m.irregular_cost;

// 실적 달 뒤에 예측을 붙인다. 체험 모드와 로그인 모드가 같은 계산을 쓴다.
// - 실적은 마지막으로 이어진 구간만 쓴다(빈 달이 있으면 그 뒤부터)
// - 마지막 실적 달의 월말 잔액 = 지금 보유자금(currentCash)으로 보고, 지난 잔액은 거꾸로 계산한다
// - 예측은 경영정보로 계산한 달(forecast)을 쓰고, 다음 달과 이어지지 않으면 최근 3개월 평균을 쓴다
export function withRecords(
  records: MonthlyRecord[],
  currentCash: number,
  reserve: number,
  forecast: AnalysisMonth[] = [],
): RecordedAnalysis | null {
  const sorted = [...records].sort((a, b) => a.month.localeCompare(b.month));
  let first = sorted.length - 1;
  while (first > 0 && addMonth(sorted[first - 1].month, 1) === sorted[first].month) first -= 1;
  const actual = sorted.slice(Math.max(0, first));
  if (!actual.length) return null;

  const start = actual[0].month;
  const startCash = currentCash - actual.reduce((total, m) => total + net(m), 0);
  const next = addMonth(actual[actual.length - 1].month, 1);
  const from = forecast.findIndex((m) => m.month === next);
  let future = from < 0 ? [] : forecast.slice(from, from + FORECAST_MONTHS).map(toInput);
  if (future.length < FORECAST_MONTHS) {
    const recent = actual.slice(-AVERAGE_MONTHS);
    const average = (pick: (m: MonthInput) => number) =>
      Math.round(recent.reduce((total, m) => total + pick(m), 0) / recent.length / 10_000) * 10_000;
    const typical = {
      sales: average((m) => m.sales),
      ingredient_cost: average((m) => m.ingredient_cost),
      fixed_cost: average((m) => m.fixed_cost),
      irregular_cost: 0,
    };
    future = [...future, ...Array.from({ length: FORECAST_MONTHS - future.length }, () => ({ ...typical }))];
  }
  const inputs = actual.map(toInput);
  return {
    history: buildAnalysis(start, startCash, reserve, inputs),
    combined: buildAnalysis(start, startCash, reserve, [...inputs, ...future]),
    forecastStart: inputs.length,
  };
}
