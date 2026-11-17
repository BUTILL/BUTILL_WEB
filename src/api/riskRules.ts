import { applyScenario } from "./scenarioEngine";
import type { Analysis, AnalysisMonth } from "./types";

// 웹 주요 위험원인 분석 기준(프로젝트 내부 잠정 기준). 기획이 바뀌면 여기만 고친다.
export const RISK_RULES = {
  salesDropPct: 10, // SAL-01: 최근 3개월 평균 매출이 이전 3개월보다 10% 이상 감소
  ingredientRatioPct: 45, // MIX-01: 원재료비율 주의 기준
  fixedRatioPct: 55, // FIX-01: 전체 고정비율
  totalExpenseRatioPct: 90, // MIX-01: 총지출이 매출의 90% 이상
  negativeStreakMonths: 2, // CASH-01: 월 순현금흐름 연속 음수
  sensitivitySalesPct: -10, // SEN-01: 매출 10% 감소 가정
  sensitivityRunwayPct: 30, // SEN-01: Runway 30% 이상 단축
  sensitivityRunwayMonths: 3, // SEN-01: 또는 3개월 이상 단축
} as const;

export type RiskCause = { code: string; title: string; description: string; expenseWon: number | null };

const sum = (rows: AnalysisMonth[], pick: (m: AnalysisMonth) => number) => rows.reduce((total, m) => total + pick(m), 0);
const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0);
const monthName = (m: AnalysisMonth) => `${Number(m.month.slice(5, 7))}월`;
const manwon = (won: number) => `${Math.round(won / 10_000).toLocaleString("ko-KR")}만원`;

// 표시 조건을 만족한 원인만 위험도 순서대로 돌려준다
export function detectRiskCauses(analysis: Analysis, rows: AnalysisMonth[]): RiskCause[] {
  const found: RiskCause[] = [];
  if (!rows.length) return found;
  const sales = sum(rows, (m) => m.sales);
  const ingredient = sum(rows, (m) => m.ingredient_cost);
  const fixed = sum(rows, (m) => m.fixed_cost);
  const irregular = sum(rows, (m) => m.irregular_cost);
  const ingredientRatio = pct(ingredient, sales);
  const fixedRatio = pct(fixed, sales);
  const totalRatio = pct(ingredient + fixed + irregular, sales);

  // CASH-01 지속 순현금유출: 가장 긴 연속 음수 구간
  let streak: AnalysisMonth[] = [];
  let longest: AnalysisMonth[] = [];
  for (const m of rows) {
    streak = m.net_cashflow < 0 ? [...streak, m] : [];
    if (streak.length > longest.length) longest = streak;
  }
  if (longest.length >= RISK_RULES.negativeStreakMonths) {
    found.push({
      code: "CASH-01",
      title: "지속 순현금유출",
      description: `${monthName(longest[0])}부터 ${longest.length}개월 연속 돈이 더 나갔어요. 현재 보유자금은 남아 있지만 매월 현금이 감소하는 구조가 지속되고 있습니다.`,
      expenseWon: -sum(longest, (m) => m.net_cashflow),
    });
  }

  // SAL-01 지속 매출 감소: 최근 3개월과 그 이전 3개월 비교
  if (rows.length >= 6) {
    const recent = rows.slice(-3);
    const before = rows.slice(-6, -3);
    const recentAvg = sum(recent, (m) => m.sales) / 3;
    const beforeAvg = sum(before, (m) => m.sales) / 3;
    const drop = pct(beforeAvg - recentAvg, beforeAvg);
    if (drop >= RISK_RULES.salesDropPct) {
      found.push({
        code: "SAL-01",
        title: "지속 매출 감소",
        description: `최근 3개월 평균 매출이 ${manwon(recentAvg)}으로 이전 3개월(${manwon(beforeAvg)})보다 ${drop}% 줄었어요. 일시적인 변동이 아니라 지속되는 흐름이라 월 현금흐름과 버틸 기간이 함께 나빠졌습니다.`,
        expenseWon: Math.round((beforeAvg - recentAvg) * 3),
      });
    }
  }

  // MIX-01 복합 비용 부담: 원재료비율·고정비율이 모두 기준을 넘고 총지출이 매출의 90% 이상
  const overIngredient = ingredientRatio >= RISK_RULES.ingredientRatioPct;
  const overFixed = fixedRatio >= RISK_RULES.fixedRatioPct;
  if (overIngredient && overFixed && totalRatio >= RISK_RULES.totalExpenseRatioPct) {
    found.push({
      code: "MIX-01",
      title: "복합 비용 부담",
      description: `원재료비(매출의 ${ingredientRatio}%)와 고정비(${fixedRatio}%)가 함께 높아 총지출이 매출의 ${totalRatio}%예요. 한 가지 비용보다 여러 비용이 동시에 부담을 주고 있습니다.`,
      expenseWon: ingredient + fixed + irregular,
    });
  }

  // EXP-01 예정 지출 집중: 비정기 지출 후 잔액이 0원 이하이거나 다음 달 필수 지출보다 적음
  const crowded = rows.filter((m) => {
    if (m.irregular_cost <= 0) return false;
    const next = analysis.monthly[analysis.monthly.findIndex((x) => x.month === m.month) + 1];
    return m.cash_balance <= 0 || (next && m.cash_balance < next.ingredient_cost + next.fixed_cost);
  });
  if (crowded.length) {
    found.push({
      code: "EXP-01",
      title: "예정 지출 집중",
      description: `${crowded.map(monthName).join("·")}에 세금·수리비 같은 큰 지출(${manwon(sum(crowded, (m) => m.irregular_cost))})이 몰려, 낸 뒤 남는 돈이 다음 달 필수 지출보다 적어요. 평소 영업과 별개로 현금이 모자랄 수 있습니다.`,
      expenseWon: sum(crowded, (m) => m.irregular_cost),
    });
  }

  // FIX-01 고정비 부담 (복합 비용 부담이 이미 잡혔으면 생략)
  if (overFixed && !found.some((r) => r.code === "MIX-01")) {
    found.push({
      code: "FIX-01",
      title: "고정비 부담",
      description: `임대료·인건비 같은 고정비가 매출의 ${fixedRatio}%예요. 매출 대비 고정비 부담이 높아 매출이 줄면 현금흐름이 빠르게 나빠질 수 있습니다.`,
      expenseWon: fixed,
    });
  }

  // SEN-01 조건 변화 취약: 매출이 10% 줄면 버틸 기간이 30% 이상 또는 3개월 이상 줄어듦
  const months = analysis.monthly.length;
  const base = applyScenario(analysis, []).shortageIndex ?? months;
  const shocked = applyScenario(analysis, [{ salesPct: RISK_RULES.sensitivitySalesPct, ingredientPct: 0, fixedPct: 0, startIndex: 0 }]).shortageIndex ?? months;
  const lost = base - shocked;
  if (lost > 0 && (lost >= RISK_RULES.sensitivityRunwayMonths || pct(lost, base) >= RISK_RULES.sensitivityRunwayPct)) {
    found.push({
      code: "SEN-01",
      title: "조건 변화 취약",
      description: `매출이 10%만 줄어도 버틸 기간이 ${base}개월에서 ${shocked}개월로 ${lost}개월 줄어요. 작은 매출 변화에도 자금 유지 기간이 크게 줄어드는 비용 구조입니다.`,
      expenseWon: null,
    });
  }

  // CASH-02 일시적 현금 감소: 한 달만 음수이고 이후 2개월은 다시 양수
  const dip = rows.findIndex((m, i) =>
    m.net_cashflow < 0 && (i === 0 || rows[i - 1].net_cashflow >= 0)
    && rows[i + 1]?.net_cashflow > 0 && rows[i + 2]?.net_cashflow > 0);
  if (dip >= 0) {
    found.push({
      code: "CASH-02",
      title: "일시적 현금 감소",
      description: `${monthName(rows[dip])}에 일회성 지출로 현금이 줄었지만, 이후 두 달은 다시 돈이 남아 지속적인 적자로 이어지지는 않아요.`,
      expenseWon: -rows[dip].net_cashflow,
    });
  }

  return found;
}
