import { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import "../css/SimulationAnalysisWebPage.css";
import "../css/TaxAnalysisWebPage.css";

import { loadStoreTax } from "../api/butill";
import { taxProfile, toTaxEvents } from "../api/mappers";
import { useLoad } from "../api/useLoad";
import {
  kindDescriptions,
  kindLabels,
  months,
  monthNames,
  taxKinds,
  taxSourceLinks,
  type TaxKind,
} from "../data/taxCalendar";

const thisYear = new Date().getFullYear();

export default function TaxAnalysisWebPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedKind, setSelectedKind] = useState<TaxKind | "all">("all");
  const [state, reload] = useLoad(loadStoreTax);
  const tax = state.status === "ready" ? state.data.tax : null;
  const taxEvents = tax ? toTaxEvents(tax) : [];
  const profile = tax ? taxProfile(tax) : null;

  useEffect(() => {
    document.title = "BUTILL | 연간 세금 관리";
  }, []);

  const visibleEvents = taxEvents
    .filter((event) => event.month === selectedMonth)
    .filter((event) => selectedKind === "all" || event.kind === selectedKind)
    .sort((a, b) => a.day - b.day);

  return (
    <main className="analysis-web tax-web">
      <DashboardHeader activePage="tax" />

      <div className="analysis-container tax-container">
        <section className="analysis-hero tax-hero">
          <div>
            <span className="analysis-kicker">BUTILL TAX PLANNER · 다가오는 1년</span>
            <h1>일 년 세금 일정을 미리 확인하세요</h1>
            <p>
              사업자 유형과 직원 고용 정보를 기준으로 주요 신고·납부 일정을
              한곳에 모았어요.
            </p>
          </div>
          <span className="analysis-sample-tag">
            <i /> {tax?.saved ? "앱 세금 설정 기준" : "기본 설정 기준"}
          </span>
        </section>

        <section className="tax-profile-strip" aria-label="적용한 세금 프로필">
          <div>
            <small>적용 프로필</small>
            <strong>{profile?.title ?? "—"}</strong>
          </div>
          {profile?.tags.map((tag) => <span key={tag}>{tag}</span>)}
          <p>
            {state.status === "loading"
              ? "세금 설정을 불러오는 중이에요."
              : state.status === "error"
                ? state.message
                : !state.data.store
                  ? "등록된 매장이 없어요. 매장을 먼저 등록해 주세요."
                  : tax?.saved
                    ? "버틸 앱에 입력한 세금 설정이 반영되었어요."
                    : "앱에서 세금 설정을 저장하기 전이라 기본값(개인 일반과세자·직원 있음)으로 보여 줘요."}
          </p>
          {state.status === "error" && (
            <button type="button" onClick={() => reload().catch(() => undefined)}>다시 시도</button>
          )}
        </section>

        <section className="tax-summary-grid" aria-label="연간 일정 요약">
          <article>
            <span>1년 주요 일정</span>
            <strong>{taxEvents.length}건</strong>
            <small>원천세는 매월 포함</small>
          </article>
          <article>
            <span>부가가치세</span>
            <strong>
              {taxEvents.filter((event) => event.kind === "vat").length}회
            </strong>
            <small>확정신고 및 예정고지</small>
          </article>
          <article>
            <span>직원 원천세</span>
            <strong>매월</strong>
            <small>다음 달 신고·납부</small>
          </article>
        </section>

        <section className="tax-calendar-section">
          <div className="tax-section-heading">
            <div>
              <span className="analysis-kicker">ANNUAL TAX CALENDAR</span>
              <h2>다가오는 1년 세무 일정</h2>
            </div>
            <div className="tax-filters" role="group" aria-label="세목 필터">
              {taxKinds.map((kind) => (
                <button
                  key={kind.key}
                  type="button"
                  className={selectedKind === kind.key ? "active" : ""}
                  aria-pressed={selectedKind === kind.key}
                  onClick={() => setSelectedKind(kind.key)}
                >
                  {kind.label}
                </button>
              ))}
            </div>
          </div>

          <div className="tax-month-grid">
            {months.map((month) => {
              const monthEvents = taxEvents
                .filter((event) => event.month === month)
                .filter(
                  (event) =>
                    selectedKind === "all" || event.kind === selectedKind,
                )
                .sort((a, b) => a.day - b.day);
              return (
                <button
                  key={month}
                  type="button"
                  className={
                    selectedMonth === month ? "tax-month selected" : "tax-month"
                  }
                  aria-pressed={selectedMonth === month}
                  onClick={() => setSelectedMonth(month)}
                >
                  <span className="tax-month-title">
                    <b>{monthNames[month - 1]}</b>
                    <small>
                      {monthEvents.length
                        ? `${monthEvents.length}건`
                        : "일정 없음"}
                    </small>
                  </span>
                  {monthEvents.length ? (
                    <span className="tax-month-events">
                      {monthEvents.slice(0, 2).map((event) => (
                        <span
                          className={`tax-mini-event ${event.kind}`}
                          key={`${event.day}-${event.name}`}
                        >
                          <b>{event.day}일</b>
                          <span>{event.name}</span>
                        </span>
                      ))}
                      {monthEvents.length > 2 && (
                        <small>외 {monthEvents.length - 2}건</small>
                      )}
                    </span>
                  ) : (
                    <span className="tax-month-empty">
                      등록된 주요 일정이 없어요
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <section className="tax-month-detail" aria-live="polite">
            <div className="tax-month-detail-heading">
              <div>
                <span className="analysis-kicker">MONTHLY DETAILS</span>
                <h3>{monthNames[selectedMonth - 1]} 세무 일정</h3>
              </div>
              <span>{visibleEvents.length}건</span>
            </div>
            {visibleEvents.length ? (
              <div className="tax-event-list">
                {visibleEvents.map((event) => (
                  <article
                    className="tax-event-row"
                    key={`${event.month}-${event.day}-${event.name}`}
                  >
                    <div className={`tax-event-date ${event.kind}`}>
                      <b>
                        {String(event.month).padStart(2, "0")}.
                        {String(event.day).padStart(2, "0")}
                      </b>
                      <small>{event.year ?? thisYear}년</small>
                    </div>
                    <div className="tax-event-description">
                      <span className={`tax-kind-tag ${event.kind}`}>
                        {kindLabels[event.kind]}
                      </span>
                      <h4>{event.name}</h4>
                      <p>{event.detail}</p>
                    </div>
                    <small className="tax-event-applies">{event.applies}</small>
                  </article>
                ))}
              </div>
            ) : (
              <p className="tax-empty-state">
                선택한 세목의 일정이 없는 달이에요.
              </p>
            )}
          </section>
        </section>

        <section className="tax-info-section">
          <div className="tax-section-heading">
            <div>
              <span className="analysis-kicker">TAX GUIDE</span>
              <h2>세금별로 알아두세요</h2>
            </div>
            <span>세부 대상 여부는 국세청 고지와 신고 안내를 확인하세요.</span>
          </div>
          <div className="tax-info-grid">
            {(Object.keys(kindLabels) as TaxKind[]).map((kind) => (
              <article className={`tax-info-card ${kind}`} key={kind}>
                <span className={`tax-kind-tag ${kind}`}>
                  {kindLabels[kind]}
                </span>
                <h3>
                  {kind === "vat"
                    ? "매출·매입을 정리해 신고해요"
                    : kind === "income"
                      ? "연간 사업소득을 정산해요"
                      : "직원 급여에서 세금을 원천징수해요"}
                </h3>
                <p>{kindDescriptions[kind]}</p>

              </article>
            ))}
          </div>
        </section>

        <aside className="tax-notice">
          <strong>일정 안내</strong>
          <p>
            {tax?.basis ?? "세법상 기본 신고·납부 기한 기준 참고 일정입니다."} 실제
            신고·납부 기한과 대상 여부는 사업자 유형, 고지 여부, 공휴일 등에 따라
            달라질 수 있으니 국세청 안내를 함께 확인하세요.
          </p>
          <div>
            {taxSourceLinks.map((source) => (
              <a
                key={source.title}
                href={source.href}
                target="_blank"
                rel="noreferrer"
              >
                {source.title} ↗
              </a>
            ))}
          </div>
        </aside>
        <footer className="analysis-footer">
          <span>BUTILL</span>
          <span>세금 설정 기준 참고 일정이며 세액은 계산하지 않아요.</span>
        </footer>
      </div>
    </main>
  );
}
