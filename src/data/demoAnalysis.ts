import { CHART_OPTIONS, withRecords, type MonthlyRecord } from "../api/localAnalysis";

// 체험 모드 예시 실적: 2026년 6월~11월(팀 공유 예시표, 단위 만원).
// 표의 지출 합계를 고정비 1,100만원 + 7월 비정기 지출 150만원 + 나머지 식재료비로 나눴다.
// 현재 보유자금 662만원, 예비자금 500만원 → 월말 총잔액 1,052 → 662만원, 가용잔액 552 → 162만원.
// 로그인 모드와 같은 계산(withRecords)을 쓰고, 경영정보가 없으므로 예측은 최근 3개월 평균이다.
const MANWON = 10_000;
const FIXED = 1100;
const rows = [
  { month: "2026-06-01", sales: 2200, expense: 2120, irregular: 0 },
  { month: "2026-07-01", sales: 2150, expense: 2270, irregular: 150 },
  { month: "2026-08-01", sales: 2050, expense: 2080, irregular: 0 },
  { month: "2026-09-01", sales: 1950, expense: 2010, irregular: 0 },
  { month: "2026-10-01", sales: 1850, expense: 1930, irregular: 0 },
  { month: "2026-11-01", sales: 1750, expense: 1850, irregular: 0 },
];

export const demoRecords: MonthlyRecord[] = rows.map((r) => ({
  month: r.month,
  sales: r.sales * MANWON,
  ingredient_cost: (r.expense - FIXED - r.irregular) * MANWON,
  fixed_cost: FIXED * MANWON,
  irregular_cost: r.irregular * MANWON,
}));

export const demoRecorded = withRecords(demoRecords, 662 * MANWON, 500 * MANWON)!;
// 현금흐름 그래프용: 로그인 모드와 같은 12칸 규칙
export const demoChart = withRecords(demoRecords, 662 * MANWON, 500 * MANWON, [], CHART_OPTIONS)!;
// 분석 보고서용: 실적 6개월
export const demoAnalysis = demoRecorded.history;
// 시뮬레이션용: 실적 6개월 + 예측 6개월
export const demoForecastAnalysis = demoRecorded.combined;
