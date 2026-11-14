export type TaxKind = "vat" | "income" | "withholding";
export type TaxEvent = {
  year?: number;
  month: number;
  day: number;
  kind: TaxKind;
  name: string;
  detail: string;
  applies: string;
};

// 일정 예시 데이터입니다. 실제 적용 전에는 백엔드와 과세 기준을 확인하세요.
export const taxCalendarYear = 2026;
export const months = Array.from({ length: 12 }, (_, index) => index + 1);
export const monthNames = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

const withholdingDates = [12, 10, 10, 10, 11, 10, 10, 10, 10, 12, 10, 10];

export const taxEvents: TaxEvent[] = [
  ...withholdingDates.map((day, index) => ({
    month: index + 1,
    day,
    kind: "withholding" as const,
    name: "원천세 신고·납부",
    detail: `${index + 1}월분 급여 원천세 신고 및 납부`,
    applies: "직원을 고용한 사업장",
  })),
  {
    month: 1,
    day: 26,
    kind: "vat",
    name: "부가가치세 확정신고",
    detail: "2025년 제2기 사업 실적 신고·납부",
    applies: "일반과세자 · 간이과세자",
  },
  {
    month: 4,
    day: 27,
    kind: "vat",
    name: "부가가치세 예정고지",
    detail: "고지서를 받은 경우 예정고지세액 납부",
    applies: "개인 일반과세자 중 고지 대상자",
  },
  {
    month: 6,
    day: 1,
    kind: "income",
    name: "종합소득세 확정신고",
    detail: "2025년 귀속 종합소득세·개인지방소득세 신고·납부",
    applies: "종합소득 신고 대상자",
  },
  {
    month: 7,
    day: 27,
    kind: "vat",
    name: "부가가치세 확정신고",
    detail: "2026년 제1기 사업 실적 신고·납부",
    applies: "일반과세자",
  },
  {
    month: 11,
    day: 2,
    kind: "vat",
    name: "부가가치세 예정고지",
    detail: "고지서를 받은 경우 예정고지세액 납부",
    applies: "개인 일반과세자 중 고지 대상자",
  },
  {
    month: 11,
    day: 30,
    kind: "income",
    name: "종합소득세 중간예납",
    detail: "고지 또는 추계액 신고 대상 여부 확인",
    applies: "중간예납 대상자",
  },
];

export const taxKinds: { key: TaxKind | "all"; label: string }[] = [
  { key: "all", label: "전체 일정" },
  { key: "vat", label: "부가가치세" },
  { key: "income", label: "소득세" },
  { key: "withholding", label: "원천세" },
];

export const kindLabels: Record<TaxKind, string> = {
  vat: "부가가치세",
  income: "소득세",
  withholding: "원천세",
};

export const kindDescriptions: Record<TaxKind, string> = {
  vat: "매출세액에서 공제 가능한 매입세액을 뺀 금액을 신고·납부해요. 개인 일반과세자는 1월·7월 확정신고와 예정고지 대상 여부를 확인하세요.",
  income:
    "사업소득 등 종합소득을 다음 해에 신고해요. 중간예납은 고지 대상 여부에 따라 납부 일정이 생길 수 있어요.",
  withholding:
    "직원 급여를 지급할 때 원천징수한 세금을 신고·납부해요. 일반적으로 다음 달 10일까지 신고합니다.",
};

export const taxSourceLinks = [
  {
    title: "국세청 세무일정",
    href: `https://www.nts.go.kr/nts/ad/taxSchdul/selectList.do?mi=135747&taxMonth=&taxYear=${taxCalendarYear}`,
  },
  {
    title: "부가가치세 안내",
    href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7693&mi=2401",
  },
  {
    title: "종합소득세 안내",
    href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7664&mi=2224",
  },
];
