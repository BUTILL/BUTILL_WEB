export type ScenarioKey = "basic" | "optimistic" | "pessimistic";

export type ScenarioMeta = {
  key: ScenarioKey;
  name: string;
  label: string;
  color: string;
  tint: string;
  assumptions: string[];
  insight: string;
};

export type Scenario = ScenarioMeta & {
  period: string;
  runwayNote?: string;
  fundsInTenThousands: number[];
};

export type ScenarioAssumptions = Record<ScenarioKey, string[]>;

// 백엔드 비교 조건(src/api/butill.ts의 OPTIMISTIC, PESSIMISTIC)과 같은 가정
export const scenarioMeta: ScenarioMeta[] = [
  {
    key: "basic", name: "기본 시나리오", label: "입력한 경영정보 유지", color: "#1769d2", tint: "#edf4ff",
    assumptions: ["입력한 월 매출 유지", "입력한 월 지출 유지"],
    insight: "앱에 입력한 매출과 지출이 이어질 때의 자금 변화를 보여줍니다.",
  },
  {
    key: "optimistic", name: "낙관 시나리오", label: "매출 성장", color: "#149447", tint: "#edf8f1",
    assumptions: ["매출 15% 증가 가정"],
    insight: "매출이 늘어나는 경우를 가정한 자금 흐름입니다.",
  },
  {
    key: "pessimistic", name: "비관 시나리오", label: "매출 감소 · 원가 상승", color: "#d83c3c", tint: "#fff0ef",
    assumptions: ["매출 15% 감소 가정", "원재료비 8% 상승 가정"],
    insight: "매출과 원재료비가 불리하게 변할 때의 위험 구간입니다.",
  },
];

// 시연용 값입니다. 실제 서비스에서는 API 응답으로 교체하세요.
export const scenarios: Scenario[] = [
  {
    key: "basic",
    name: "기본 시나리오",
    label: "현재 추세 유지",
    period: "약 8개월",
    color: "#1769d2",
    tint: "#edf4ff",
    fundsInTenThousands: [
      2845, 2450, 2070, 1690, 1320, 960, 610, 260, -80, -450, -800, -1150,
    ],
    assumptions: ["최근 3개월 평균 매출 유지", "입력한 월 지출 유지"],
    insight: "현재 운영 흐름이 이어질 때의 자금 변화를 보여줍니다.",
  },
  {
    key: "optimistic",
    name: "낙관 시나리오",
    label: "매출 성장",
    period: "약 12개월 이상",
    color: "#149447",
    tint: "#edf8f1",
    fundsInTenThousands: [
      2845, 2880, 2960, 3040, 2950, 3120, 3290, 3460, 3630, 3800, 3970, 4140,
    ],
    assumptions: ["신메뉴 반응 양호", "매출 15% 증가 가정"],
    insight: "신메뉴 매출이 늘어나는 경우를 가정한 자금 흐름입니다.",
  },
  {
    key: "pessimistic",
    name: "비관 시나리오",
    label: "매출 감소 · 원가 상승",
    period: "약 5개월",
    color: "#d83c3c",
    tint: "#fff0ef",
    fundsInTenThousands: [
      2845, 2150, 1600, 1050, 530, -20, -500, -900, -1250, -1600, -1900, -2200,
    ],
    assumptions: ["매출 15% 감소 가정", "원재료비 8% 상승 가정"],
    insight: "매출과 원재료비가 불리하게 변할 때의 위험 구간입니다.",
  },
];
