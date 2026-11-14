import { rawMaterialItems } from "./rawMaterials";
import type { ReportData } from "./reportData";

// 분석 보고서 화면 시안 확인용 데이터
export const sampleReportData: ReportData = {
  analysisDate: "2026-11-12",
  period: {
    startDate: "2026-10-15",
    endDate: "2026-11-11",
    weeks: 4,
  },
  runwayMonths: 8.4,
  availableCashWon: 28_450_000,
  projectedShortfallWon: -487_000,
  monthlyNetCashFlowWon: 3_150_000,
  risks: [
    // 원재료비 분석 화면과 같은 상승 품목 기준을 사용
    ...(rawMaterialItems.some((item) => item.type === "up")
      ? [{
          title: "원재료비 상승",
          description: "주요 원재료의 가격 상승으로 원가 부담이 커짐",
        }]
      : []),
    {
      title: "고정 지출 부담",
      description: "임대료, 인건비 등 고정비가 지속적으로 발생",
    },
    {
      title: "매출 변동",
      description: "주문량과 매출이 주차별로 변동하여 현금 유입이 불안정함",
    },
  ],
};
