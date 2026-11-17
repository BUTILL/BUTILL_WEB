import { useCallback, useEffect, useState } from "react";
import Home from "./Home";
import Report from "./Report";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import SimulationAnalysisWebPage from "./SimulationAnalysisWebPage";
import RawMaterialsAnalysisWebPage from "./RawMaterialsAnalysisWebPage";
import TaxAnalysisWebPage from "./TaxAnalysisWebPage";
import SupportProgramsWebPage from "./SupportProgramsWebPage";
import { loadStoreAnalysis } from "../api/butill";
import { toDashboard } from "../api/mappers";
import { loadNothing, useLoad } from "../api/useLoad";
import { isDemo } from "../data/demo";
import { demoRecorded } from "../data/demoAnalysis";
import { hasWebSession } from "../data/webSession";
import "../css/App.css";
import "../css/DeliveredPages.css";

// 메뉴 URL과 화면 연결. 각 화면은 로그인한 계정의 첫 번째 매장 데이터를 불러옵니다.
const pages = new Map([
  ["/login", LoginPage],
  ["/signup", SignupPage],
  ["/simulation", SimulationAnalysisWebPage],
  ["/raw-materials", RawMaterialsAnalysisWebPage],
  ["/tax", TaxAnalysisWebPage],
  ["/support", SupportProgramsWebPage],
]);
const publicPaths = new Set(["", "/intro", "/login", "/signup"]);

export default function App() {
  // 주소 끝에 슬래시가 붙어도 같은 화면을 표시합니다.
  const path = window.location.pathname.replace(/\/+$/, "");
  const publicPage = publicPaths.has(path);
  const needsLogin = !publicPage && !hasWebSession();

  // 로그아웃 후 뒤로가기로 캐시된 분석 화면을 열어도 로그인 화면으로 이동합니다.
  useEffect(() => {
    if (publicPage) return;
    const checkSession = () => {
      if (!hasWebSession()) window.location.replace("/login");
    };
    if (needsLogin) checkSession();
    window.addEventListener("pageshow", checkSession);
    return () => window.removeEventListener("pageshow", checkSession);
  }, [publicPage, needsLogin]);

  if (needsLogin) return null;

  if (path === "" || path === "/intro") {
    return <LandingPage showBack={path === "/intro"} />;
  }

  if (path === "/report") {
    return <ReportPage />;
  }

  const Page = pages.get(path);
  if (Page) {
    return <Page />;
  }

  return <HomePage />;
}

// 매장·경영정보가 없거나 불러오지 못했을 때 화면에 보여 줄 안내
function analysisNotice(state, retry) {
  if (state.status === "loading") return { title: "현금흐름을 불러오는 중이에요", message: "잠시만 기다려 주세요." };
  if (state.status === "error") return { title: "현금흐름을 불러오지 못했어요", message: state.message, action: { label: "다시 시도", onClick: retry } };
  if (!state.data.store) return { title: "등록된 매장이 없어요", message: "회원가입 화면 또는 버틸 앱에서 매장을 먼저 등록해 주세요." };
  if (!state.data.analysis) return { title: "경영정보를 먼저 입력해 주세요", message: `${state.data.store.name}의 보유자금, 매출, 비용을 버틸 앱에서 입력하면 분석 결과가 표시돼요.` };
  return null;
}

function HomePage() {
  const demo = isDemo();
  const [state, reload] = useLoad(demo ? loadNothing : loadStoreAnalysis);
  // 보고서·시나리오와 같은 데이터: 월별 실적이 있으면 실적 + 예측 6개월, 없으면 경영정보 예측
  if (demo) return <Home data={toDashboard(demoRecorded.combined, demoRecorded.forecastStart)} />;
  const recorded = state.status === "ready" ? state.data?.recorded : null;
  const analysis = state.status === "ready" ? state.data?.analysis : null;
  const notice = analysisNotice(state, () => reload().catch(() => undefined));
  const data = recorded
    ? toDashboard(recorded.combined, recorded.forecastStart)
    : analysis ? toDashboard(analysis) : null;
  return <Home data={data} notice={notice} />;
}

// 같은 브라우저에서 다시 열어도 마지막 새로고침 시각을 유지
const reportRefreshKey = "butill:report:last-refresh";

function readReportRefresh() {
  try {
    const refresh = localStorage.getItem(reportRefreshKey);
    return refresh && Number.isFinite(Date.parse(refresh)) ? refresh : undefined;
  } catch {
    return undefined;
  }
}

const toOutlook = (recorded) => (recorded ? { analysis: recorded.combined, forecastStart: recorded.forecastStart } : null);

function ReportPage() {
  const demo = isDemo();
  const [state, reload] = useLoad(demo ? loadNothing : loadStoreAnalysis);
  const [refreshedAt, setRefreshedAt] = useState(readReportRefresh);
  // 월별 실적이 있으면 실적 달만 분석하고(체험 모드와 같은 방식), 없으면 경영정보 예측을 분석
  const analysis = state.status === "ready" ? state.data?.recorded?.history ?? state.data?.analysis : null;

  // 새로고침: 저장된 경영정보로 다시 계산하고, 성공한 시각을 화면에 전달
  const refreshReport = useCallback(async (_analysisDate, requestedAt) => {
    if (!demo) await reload();
    setRefreshedAt(requestedAt);
    try {
      localStorage.setItem(reportRefreshKey, requestedAt);
    } catch {
      // 저장소를 사용할 수 없어도 현재 화면에는 갱신 결과를 표시
    }
  }, [reload, demo]);

  if (demo) {
    return <Report analysis={demoRecorded.history} outlook={toOutlook(demoRecorded)} refreshedAt={refreshedAt} onRefresh={refreshReport} />;
  }

  const notice = analysisNotice(state, () => reload().catch(() => undefined));
  return (
    <Report
      analysis={analysis}
      outlook={toOutlook(state.status === "ready" ? state.data?.recorded : null)}
      notice={notice}
      refreshedAt={refreshedAt}
      onRefresh={refreshReport}
    />
  );
}
