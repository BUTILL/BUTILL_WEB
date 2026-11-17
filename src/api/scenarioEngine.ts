import type { Analysis } from "./types";

// 시나리오 가정 하나: startIndex~endIndex 달(분석 시작 월 기준 0부터, 끝 포함) 동안 매출·원재료비·고정비를 몇 % 바꿀지
export type ScenarioAssumption = {
  salesPct: number;
  ingredientPct: number;
  fixedPct: number;
  startIndex: number;
  endIndex?: number | null; // 비우면 마지막 달까지
};

export type ScenarioResult = {
  funds: number[]; // 월말 가용자금(만원)
  period: string;
  runwayNote: string;
  shortageIndex: number | null;
};

export const ASSUMPTION_LIMIT = { min: -100, max: 500 };

const monthLabel = (date: string) => `${Number(date.slice(0, 4))}년 ${Number(date.slice(5, 7))}월`;
const percentOf = (amount: number, pct: number) => Math.round((amount * pct) / 100);
const active = (a: ScenarioAssumption, index: number) => index >= a.startIndex && (a.endIndex == null || index <= a.endIndex);

export function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(ASSUMPTION_LIMIT.max, Math.max(ASSUMPTION_LIMIT.min, Math.round(value)));
}

// 기본 분석의 월말 가용잔액에 가정으로 바뀐 금액을 누적해서 더한다. 기간이 겹치는 가정은 %를 합친다
// 버틸 기간은 fromIndex 달(지금)부터 센다. 실적이 앞에 있으면 실적 달 수만큼 넘겨준다
export function applyScenario(analysis: Analysis, assumptions: ScenarioAssumption[], fromIndex = 0): ScenarioResult {
  let delta = 0;
  const balances = analysis.monthly.map((m, index) => {
    const on = assumptions.filter((a) => active(a, index));
    const pct = (pick: (a: ScenarioAssumption) => number) => on.reduce((total, a) => total + pick(a), 0);
    delta += percentOf(m.sales, Math.max(-100, pct((a) => a.salesPct)))
      - percentOf(m.ingredient_cost, Math.max(-100, pct((a) => a.ingredientPct)))
      - percentOf(m.fixed_cost, Math.max(-100, pct((a) => a.fixedPct)));
    return m.available_balance + delta;
  });
  const startShort = fromIndex === 0 ? analysis.initial_available_cash < 0 : balances[fromIndex - 1] < 0;
  const ahead = balances.slice(fromIndex).findIndex((b) => b < 0);
  const shortage = startShort ? fromIndex : ahead < 0 ? -1 : fromIndex + ahead;
  const months = analysis.monthly.length - fromIndex;
  return {
    funds: balances.map((b) => Math.round(b / 10_000)),
    period: shortage < 0 ? `${months}개월 이상` : shortage === fromIndex ? "1개월 미만" : `약 ${shortage - fromIndex}개월`,
    runwayNote: shortage < 0
      ? "분석 기간 내 부족 없음"
      : `${monthLabel(analysis.monthly[shortage].month)} 가용자금 부족 예상`,
    shortageIndex: shortage < 0 ? null : shortage,
  };
}

const signed = (value: number) => `${value > 0 ? "+" : ""}${value}%`;

export function describeOne(a: ScenarioAssumption, months: string[]): string {
  const parts = [
    a.salesPct && `매출 ${signed(a.salesPct)}`,
    a.ingredientPct && `원재료비 ${signed(a.ingredientPct)}`,
    a.fixedPct && `고정비 ${signed(a.fixedPct)}`,
  ].filter(Boolean);
  if (!parts.length) return "";
  const from = months[a.startIndex] ?? "시작 월";
  const when = a.endIndex == null
    ? `${from}부터`
    : a.endIndex === a.startIndex ? `${from}만` : `${from}~${months[a.endIndex] ?? ""}`;
  return `${when} ${parts.join(" · ")}`;
}

export function describeAssumptions(list: ScenarioAssumption[], months: string[]): string {
  const texts = list.map((a) => describeOne(a, months)).filter(Boolean);
  return texts.length ? texts.join(" / ") : "입력한 경영정보 그대로";
}
