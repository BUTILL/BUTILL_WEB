export type RawItem = {
  name: string;
  package: string;
  previous: number;
  current: number;
  change: string;
  delta: string;
  monthlyImpact: string;
  type: "up" | "down" | "steady";
  source: string;
  dailyPrices: number[];
  bps?: number; // 1주 전 대비 변동률(1/10000)
  dailyDates?: string[]; // dailyPrices와 같은 순서의 조사일(YYYY-MM-DD). 주말·공휴일은 조사하지 않음
};

// 시연용 가격이며 실시간 KAMIS 데이터가 아닙니다.
export const rawMaterialItems: RawItem[] = [
  {
    name: "돼지고기 삼겹살",
    package: "국산 · 1kg",
    previous: 21900,
    current: 23700,
    change: "+8.2%",
    delta: "+1,800원",
    monthlyImpact: "월 약 +126,000원",
    type: "up",
    source: "축산물품질평가원 경락단가 연동 예시",
    dailyPrices: [
      20300, 20400, 20250, 20500, 20700, 20600, 20850, 21000, 20900, 21200,
      21100, 21400, 21500, 21350, 21600, 21800, 21700, 22000, 21800, 22100,
      22300, 22200, 22400, 22800, 22700, 23100, 23400, 23700,
    ],
  },
  {
    name: "양파",
    package: "특품 · 15kg망",
    previous: 19200,
    current: 18000,
    change: "-6.3%",
    delta: "-1,200원",
    monthlyImpact: "월 약 -24,000원",
    type: "down",
    source: "가락시장 도매 경매 평균가 예시",
    dailyPrices: [
      19000, 19100, 18900, 19200, 19300, 19150, 19000, 19200, 19400, 19300,
      19100, 19200, 19050, 19300, 19200, 19100, 18900, 19000, 19100, 18950,
      18800, 18900, 18600, 18400, 18500, 18300, 18100, 18000,
    ],
  },
  {
    name: "쌀 신동진",
    package: "상등급 · 20kg",
    previous: 54500,
    current: 54500,
    change: "0.0%",
    delta: "변동 없음",
    monthlyImpact: "월 지출 변동 없음",
    type: "steady",
    source: "농수산물유통공사 가격 정보 예시",
    dailyPrices: [
      54500, 54400, 54600, 54500, 54300, 54400, 54500, 54600, 54500, 54400,
      54300, 54500, 54600, 54400, 54500, 54300, 54400, 54500, 54600, 54500,
      54400, 54300, 54500, 54600, 54400, 54500, 54600, 54500,
    ],
  },
  {
    name: "계란 특란",
    package: "1판 · 30구",
    previous: 6600,
    current: 6900,
    change: "+4.5%",
    delta: "+300원",
    monthlyImpact: "월 약 +18,000원",
    type: "up",
    source: "양계협회 고시가 기준 예시",
    dailyPrices: [
      6400, 6420, 6380, 6450, 6480, 6440, 6500, 6510, 6490, 6550, 6530, 6580,
      6600, 6570, 6620, 6650, 6610, 6680, 6640, 6700, 6720, 6680, 6750, 6780,
      6740, 6820, 6860, 6900,
    ],
  },
  {
    name: "식용유 대두유",
    package: "업소용 · 18L 캔",
    previous: 48500,
    current: 50000,
    change: "+3.1%",
    delta: "+1,500원",
    monthlyImpact: "월 약 +15,000원",
    type: "up",
    source: "식자재 유통 도매가 예시",
    dailyPrices: [
      48500, 48700, 48600, 48900, 49100, 48800, 49000, 49300, 49100, 48900,
      48700, 49000, 49200, 48500, 48800, 49100, 49300, 49000, 49200, 49500,
      49300, 49600, 49400, 49700, 49500, 49800, 49900, 50000,
    ],
  },
];
