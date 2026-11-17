// API 응답을 이 형태로 매핑해 Report의 data에 전달
export type ReportData = {
  analysisDate: string | null; // YYYY-MM-DD
  period: {
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    weeks: number;
  } | null;
  runwayMonths: number | null;
  runwayIsMinimum?: boolean; // 예측 기간 안에 부족이 없어 "N개월 이상"
  availableCashWon: number | null;
  projectedShortfallWon: number | null; // 부족 금액은 음수
  monthlyNetCashFlowWon: number | null;
  
  risks: {
    title: string;
    description: string;
    expenseWon?: number | null; // 같은 분석 기간에 원인별로 집계한 지출액(원)
  }[];
};

export const missingValue = "—";
const numberFormat = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 });

export function formatDate(date: string | null | undefined) {
  return date ? date.replaceAll("-", ".") : missingValue;
}

export function formatWon(
  amount: number | null | undefined,
  { inTenThousands = false, showPositiveSign = false } = {},
) {
  if (amount == null) return missingValue;

  const sign = amount < 0 ? "−" : amount > 0 && showPositiveSign ? "+" : "";
  const value = inTenThousands ? Math.abs(amount) / 10_000 : Math.abs(amount);
  const unit = inTenThousands ? "만원" : "원";

  return `${sign}${numberFormat.format(value)}${unit}`;
}

export function formatRunway(months: number | null | undefined) {
  return months == null ? missingValue : `${numberFormat.format(months)}개월`;
}
