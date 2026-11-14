import { useEffect, useState } from "react";
import { getSupportPrograms } from "../api/butill";
import { todayKst } from "../api/mappers";
import type { SupportProgram, SupportPrograms } from "../api/types";
import { loadNothing, useLoad } from "../api/useLoad";
import { isDemo } from "../data/demo";
import DashboardHeader from "./DashboardHeader";
import "../css/SimulationAnalysisWebPage.css";
import "../css/SupportProgramsWebPage.css";

const SOON_DAYS = 7;
type Filter = "all" | "soon" | "open";

function daysLeft(program: SupportProgram, today: string) {
  return program.apply_end ? Math.round((Date.parse(program.apply_end) - Date.parse(today)) / 86_400_000) : null;
}

// 기업마당 공고 중 서울 소상공인 대상, 마감 전 공고만 백엔드에서 받아 마감 임박 순으로 보여 줍니다.
export default function SupportProgramsWebPage() {
  const demo = isDemo();
  const [state, reload] = useLoad<SupportPrograms | null>(demo ? loadNothing : getSupportPrograms);
  const [filter, setFilter] = useState<Filter>("all");
  const today = todayKst();
  const programs = state.status === "ready" ? state.data?.programs ?? [] : [];
  const soonCount = programs.filter((p) => (daysLeft(p, today) ?? Infinity) <= SOON_DAYS).length;
  const openCount = programs.filter((p) => p.always_open).length;
  const visible = programs.filter((p) =>
    filter === "all" ? true : filter === "open" ? p.always_open : (daysLeft(p, today) ?? Infinity) <= SOON_DAYS);

  useEffect(() => {
    document.title = "BUTILL | 소상공인 지원사업";
  }, []);

  return (
    <main className="analysis-web">
      <DashboardHeader activePage="support" />

      <div className="analysis-container">
        <section className="analysis-hero">
          <div>
            <span className="analysis-kicker">BUTILL 지원사업</span>
            <h1>지금 신청할 수 있는 지원사업을 확인하세요</h1>
            <p>서울 소상공인이 신청할 수 있는 정부·서울시 지원사업 공고를 마감이 가까운 순서로 모았어요.</p>
          </div>
          <span className="analysis-sample-tag">
            <i /> 기업마당 공고 기준
          </span>
        </section>

        <section className="analysis-metrics" aria-label="지원사업 요약">
          <article className="scenario-metric basic">
            <span>신청 가능한 공고</span>
            <strong>{programs.length}건</strong>
            <small>마감 전 · 서울 소상공인 대상</small>
          </article>
          <article className="scenario-metric pessimistic">
            <span>{SOON_DAYS}일 안에 마감</span>
            <strong>{soonCount}건</strong>
            <small>서둘러 확인하세요</small>
          </article>
          <article className="scenario-metric optimistic">
            <span>상시·예산 소진 시까지</span>
            <strong>{openCount}건</strong>
            <small>마감일이 정해지지 않은 공고</small>
          </article>
        </section>

        <div className="support-web-filters" role="group" aria-label="공고 필터">
          {([["all", "전체"], ["soon", "마감 임박"], ["open", "상시 접수"]] as [Filter, string][]).map(([key, label]) => (
            <button key={key} type="button" className={filter === key ? "active" : ""} aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>

        {demo ? (
          <div className="support-web-empty" role="status">
            <p>체험 모드에서는 실제 지원사업 공고를 불러오지 않아요. 최신 공고는 기업마당에서 확인할 수 있어요.</p>
            <a href="https://www.bizinfo.go.kr" target="_blank" rel="noreferrer">기업마당 지원사업 공고 보기 ↗</a>
          </div>
        ) : state.status !== "ready" ? (
          <div className="support-web-empty" role="status">
            <p>{state.status === "loading" ? "지원사업 공고를 불러오는 중이에요." : state.message}</p>
            {state.status === "error" && <button type="button" onClick={() => reload().catch(() => undefined)}>다시 시도</button>}
          </div>
        ) : visible.length === 0 ? (
          <div className="support-web-empty">{state.data?.status === "failed" ? "지원사업 정보를 받아오지 못했어요. 잠시 후 다시 확인해 주세요." : "조건에 맞는 공고가 없어요."}</div>
        ) : (
          <section className="support-web-list">
            {visible.map((program) => {
              const left = daysLeft(program, today);
              const badge = left === null ? "상시" : left === 0 ? "오늘 마감" : `D-${left}`;
              return (
                <article className="support-web-card" key={program.program_id}>
                  <header>
                    <h3>{program.title}</h3>
                    <span className={`support-web-badge${left === null ? " open" : left <= SOON_DAYS ? " soon" : ""}`}>{badge}</span>
                  </header>
                  <p className="support-web-meta">
                    {[program.agency, program.category, program.target].filter(Boolean).join(" · ")}
                  </p>
                  <p className="support-web-meta">신청기간: {program.apply_period_text ?? "공고 확인"}</p>
                  {program.summary && <p className="support-web-summary">{program.summary}</p>}
                  {program.url && (
                    <a href={program.url} target="_blank" rel="noreferrer">공고 자세히 보기 ↗</a>
                  )}
                </article>
              );
            })}
          </section>
        )}

        <footer className="analysis-footer">
          <span>BUTILL</span>
          <span>신청 자격과 일정은 공고 원문을 꼭 확인하세요. 버틸은 신청을 대행하지 않아요.</span>
        </footer>
      </div>
    </main>
  );
}
