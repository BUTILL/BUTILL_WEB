import { useState } from "react";
import type { ReactNode } from "react";
import DashboardHeader from "./DashboardHeader";
import type { DashboardHeaderProps } from "./DashboardHeader";
import { analysisRange, toReport, type ReportOutlook, type ReportPeriod } from "../api/mappers";
import type { Analysis } from "../api/types";
import { formatDate, formatRunway, formatWon, missingValue } from "../data/reportData";
import type { ReportData } from "../data/reportData";
import "../css/Report.css";

type ReportProps = DashboardHeaderProps & {
  data?: ReportData | null;
  analysis?: Analysis | null; // 있으면 선택한 기간으로 보고서를 다시 계산
  outlook?: ReportOutlook | null; // 월별 실적이 있을 때 앞으로의 흐름(현재 가용자금·런웨이)

  notice?: { title: string; message: string; action?: { label: string; onClick: () => void } } | null; // 데이터가 없을 때 안내
  refreshedAt?: string;
  onRefresh?: (analysisDate: string, requestedAt: string) => Promise<void>;
};

const iconPaths = {
  refresh: "M21 4v6h-6M3 20v-6h6M4 9a8 8 0 0 1 13-4l4 5M3 14l4 5a8 8 0 0 0 13-4",
  calendar: "M7 2v4m10-4v4M3 9h18M6 4h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z",
  coins: "M14 10c0 1.7-2.7 3-6 3s-6-1.3-6-3 2.7-3 6-3 6 1.3 6 3Zm0 0v8c0 1.7-2.7 3-6 3s-6-1.3-6-3v-8m0 4c0 1.7 2.7 3 6 3s6-1.3 6-3m-4-8V5c0-1.7 2.7-3 6-3s6 1.3 6 3-2.7 3-6 3c-1 0-2-.1-3-.4M22 5v10c0 1.7-2.7 3-6 3h-2m8-8c0 1.7-2.7 3-6 3h-2",
  warning: "M10.3 4.4a2 2 0 0 1 3.4 0l8 13.2A2 2 0 0 1 20 21H4a2 2 0 0 1-1.7-3.4l8-13.2ZM12 9v5m0 3h.01",
  exchange: "M3 7h17m-5-5 5 5-5 5m6 5H4m5-5-5 5 5 5",
};

function ReportIcon({ name }: { name: keyof typeof iconPaths }) {
  return (
    <svg
      className="report-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

function ReportMetric({
  icon,
  label,
  value,
  description,
  className,
}: {
  icon: keyof typeof iconPaths;
  label: string;
  value: string;
  description?: ReactNode;
  className: string;
}) {
  return (
    <div className={`report-metric ${className}`}>
      <dt className="report-metric-label">
        <span className="report-metric-icon">
          <ReportIcon name={icon} />
        </span>
        {label}
      </dt>

      <dd className="report-metric-value">
        {value}
      </dd>

      {description && <dd className="report-metric-description">
        {description}
      </dd>}
    </div>
  );
}

const dayMs = 86_400_000;
const reportPeriodKey = "butill:report:selected-period-v2";

function readSelectedPeriod(): ReportPeriod | null {
  try {
    const period = JSON.parse(sessionStorage.getItem(reportPeriodKey) ?? "null");
    if (period && /^\d{4}-\d{2}-\d{2}$/.test(period.startDate) && /^\d{4}-\d{2}-\d{2}$/.test(period.endDate)) {
      return { startDate: period.startDate, endDate: period.endDate };
    }
  } catch {
    // 저장소를 사용할 수 없으면 분석 전체 기간을 표시
  }
  return null;
}

// 분석 대상 기간: 시작일과 종료일을 직접 입력. 비우거나 순서가 바뀌면 적용하지 않는다
function ReportPeriodInputs({
  period,
  range,
  onChange,
  onReset,
}: {
  period: ReportPeriod;
  range: ReportPeriod | null;
  onChange: (period: ReportPeriod) => void;
  onReset: () => void;
}) {
  const [draft, setDraft] = useState(period);
  const [warning, setWarning] = useState("");

  function update(next: ReportPeriod) {
    setDraft(next);
    if (!next.startDate || !next.endDate) {
      setWarning("시작일과 종료일을 모두 입력하세요.");
      return;
    }
    if (next.startDate > next.endDate) {
      setWarning("종료일은 시작일보다 뒤여야 해요.");
      return;
    }
    if (range && (next.startDate < range.startDate || next.endDate > range.endDate)) {
      setWarning(`${formatDate(range.startDate)} ~ ${formatDate(range.endDate)} 안에서 골라 주세요.`);
      return;
    }
    setWarning("");
    onChange(next);
  }

  return (
    <span className="report-period-inputs">
      <label>
        <span className="report-visually-hidden">분석 시작일</span>
        <input
          type="date"
          value={draft.startDate}
          min={range?.startDate}
          max={range?.endDate}
          onChange={(event) => update({ ...draft, startDate: event.target.value })}
        />
      </label>
      <span aria-hidden="true">~</span>
      <label>
        <span className="report-visually-hidden">분석 종료일</span>
        <input
          type="date"
          value={draft.endDate}
          min={range?.startDate}
          max={range?.endDate}
          onChange={(event) => update({ ...draft, endDate: event.target.value })}
        />
      </label>
      {range && (
        <button type="button" className="report-period-reset" onClick={() => { setDraft(range); setWarning(""); onReset(); }}>
          전체 기간
        </button>
      )}
      <span className="report-period-warning" role="status">{warning}</span>
    </span>
  );
}

export default function Report({
  data: givenData,
  analysis,
  outlook,
  notice,
  refreshedAt,
  onRefresh,
  ...headerProps
}: ReportProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod | null>(readSelectedPeriod);
  const range = analysis ? analysisRange(analysis) : null;
  // 분석 결과가 있으면 선택한 기간으로 다시 계산하고, 없으면 받은 보고서를 그대로 표시
  const data = analysis ? toReport(analysis, selectedPeriod ?? range, outlook) : givenData;
  const period = data?.period ?? null;
  const remainingDays = period
    ? Math.round((Date.parse(period.endDate) - Date.parse(period.startDate)) / dayMs) % 7
    : 0;
  const risks = data?.risks;

  // 위험도 순서(현금 부족 → 비용 구조 원인)는 보고서 계산에서 정한 순서를 따른다
  const rankedRisks = risks ?? [];

  // 월 평균 순현금흐름은 음수일 때 금액을 강조
  const monthlyNet = data?.monthlyNetCashFlowWon;
  const isMonthlyNetNegative = monthlyNet != null && monthlyNet < 0;

  // 예상 부족 금액은 음수일 때 강조하고, 양수일 때 안내 문구를 표시
  const shortfall = data?.projectedShortfallWon;
  const hasShortfall = shortfall != null && shortfall < 0;
  const hasSurplus = shortfall != null && shortfall > 0;
  const shortfallStyle = hasShortfall ? " is-negative" : hasSurplus ? " is-positive" : "";

  const [refreshStatus, setRefreshStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const refreshTime = refreshedAt
    ? new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(new Date(refreshedAt))
    : null;

  function selectPeriod(nextPeriod: ReportPeriod | null) {
    setSelectedPeriod(nextPeriod);
    try {
      if (nextPeriod) sessionStorage.setItem(reportPeriodKey, JSON.stringify(nextPeriod));
      else sessionStorage.removeItem(reportPeriodKey);
    } catch {
      // 저장소를 사용할 수 없어도 현재 화면에는 선택한 기간을 표시
    }
  }

  // 한국 시간 기준으로 조회할 날짜를 정하고, 데이터 갱신이 끝난 뒤 결과를 표시
  async function handleRefresh() {
    if (!onRefresh || refreshStatus === "loading") return;

    const requestedAt = new Date();
    const timeZone = "Asia/Seoul";
    const parts = new Intl.DateTimeFormat("ko-KR", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(requestedAt);
    const analysisDate = ["year", "month", "day"]
      .map((part) => parts.find(({ type }) => type === part)?.value)
      .join("-");

    setRefreshStatus("loading");
    try {
      await onRefresh(analysisDate, requestedAt.toISOString());
      setRefreshStatus("success");
    } catch {
      setRefreshStatus("error");
    }
  }

  const refreshMessage = {
    idle: "",
    loading: "새로고침 중…",
    success: "새로고침 되었습니다",
    error: "새로고침에 실패했습니다",
  }[refreshStatus];

  return (
    <div className="report-page">
      {/* 상단바와 화면 이동 */}
      <DashboardHeader activePage="report" {...headerProps} />

      <main className="dashboard-container">
        {/* 보고서 제목과 분석 기간 */}
        <div className="report-intro">
          <div>
            <h1>분석 보고서</h1>
            <p>사업장의 현금흐름과 위험 요인을 한눈에 확인하세요.</p>
          </div>
          
          <dl className="report-dates">
            <div className="report-date-row">
              <dt>분석 기준일</dt>
              <dd>
                <span className="report-analysis-date">
                  {formatDate(data?.analysisDate)}
                  <span className="report-analysis-time" aria-hidden={!refreshTime} data-placeholder={!refreshTime}>
                    {refreshTime ?? "00:00"}
                  </span>
                </span>
                <span className="report-refresh-action">
                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={!onRefresh || refreshStatus === "loading"}
                    aria-label="보고서 새로고침"
                  >
                    <ReportIcon name="refresh" />
                  </button>
                  <span className="report-refresh-status" role="status">{refreshMessage}</span>
                </span>
              </dd>
            </div>
            <div className="report-date-row report-period-row">
              <dt><ReportIcon name="calendar" /> 분석 대상 기간</dt>
              <dd>
                {analysis && period ? (
                  <ReportPeriodInputs
                    period={period}
                    range={range}
                    onChange={selectPeriod}
                    onReset={() => selectPeriod(null)}
                  />
                ) : null}
                <span className="report-period-summary">
                  {period
                    ? `${analysis ? "" : `${formatDate(period.startDate)} ~ ${formatDate(period.endDate)} `}(${period.weeks}주${remainingDays ? ` ${remainingDays}일` : ""})`
                    : missingValue}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {notice && (
          <section className="report-panel report-notice" role="status">
            <h2 className="report-panel-title">{notice.title}</h2>
            <p>{notice.message}</p>
            {notice.action && <button type="button" onClick={notice.action.onClick}>{notice.action.label}</button>}
          </section>
        )}

        {/* 현금흐름 지표 */}
        <section className="report-panel" aria-labelledby="report-summary-title">
          <h2 className="report-panel-title" id="report-summary-title">현금흐름 요약</h2>
          <div className="report-summary">
            <dl className="report-summary-primary">
              <ReportMetric
                icon="calendar"
                label="캐시런웨이"
                value={`${formatRunway(data?.runwayMonths)}${data?.runwayIsMinimum ? " 이상" : ""}`}
                description="현재 자금으로 버틸 수 있는 예상 기간"
                className="report-metric-runway"
              />
              <ReportMetric
                icon="coins"
                label="현재 가용자금"
                value={formatWon(data?.availableCashWon, { inTenThousands: true })}
                className="report-metric-cash"
              />
            </dl>
            
            <dl className="report-summary-secondary">
              <ReportMetric
                icon="warning"
                label="예상 부족 금액"
                value={hasSurplus ? "이번달은 금액이 부족하지 않습니다" : formatWon(shortfall)}
                description="캐시런웨이 도달 시점 기준"
                className={`report-metric-shortfall${shortfallStyle}`}
              />
              <ReportMetric
                icon="exchange"
                label="월 평균 순현금흐름"
                value={formatWon(monthlyNet, { inTenThousands: true, showPositiveSign: true })}
                className={isMonthlyNetNegative ? "report-metric-net is-negative" : "report-metric-net"}
              />
            </dl>
          </div>
        </section>

        {/* 감지된 위험과 상위 위험 원인 */}
        <section className="report-panel" aria-labelledby="report-risk-title">
          <div className="report-panel-heading">
            <h2 className="report-panel-title" id="report-risk-title">위험 분석</h2>
          </div>

          <div className="report-risks">
            <div className="report-risk-count">
              <h3>감지된 위험</h3>
              <p className="report-risk-count-value">
                {risks?.length ?? 0}<span>개</span>
              </p>
              <p>현금흐름에 영향을 줄 수 있는<br />주요 위험 요인입니다.</p>
            </div>

            <div className="report-risk-ranking">
              <h3>주요 위험 원인 TOP 3</h3>
              {risks && risks.length > 0 ? (
                <ol className="report-risk-list">
                  {rankedRisks.slice(0, 3).map(({ title, description }, index) => (
                    <li className="report-risk-row" key={title}>
                      <span className="report-risk-rank" aria-hidden="true">{index + 1}</span>
                      <strong>{title}</strong>
                      <p>{description}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>{risks ? "감지된 위험이 없습니다." : "위험 분석 데이터가 없습니다."}</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
