import { useEffect, useState } from "react";
import Home from "./Home";
import Report from "./Report";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import SimulationAnalysisWebPage from "./SimulationAnalysisWebPage";
import RawMaterialsAnalysisWebPage from "./RawMaterialsAnalysisWebPage";
import TaxAnalysisWebPage from "./TaxAnalysisWebPage";
import { sampleDashboardData } from "../data/homeSample";
import { sampleReportData } from "../data/reportSample";
import { hasWebSession } from "../data/webSession";
import "../css/App.css";
import "../css/DeliveredPages.css";

// 전달받은 화면을 기존 메뉴의 URL에 연결합니다.
const pages = new Map([
  ["/login", LoginPage],
  ["/simulation", SimulationAnalysisWebPage],
  ["/raw-materials", RawMaterialsAnalysisWebPage],
  ["/tax", TaxAnalysisWebPage],
]);

// API 연결 전에는 분리한 예시 데이터로 화면을 확인합니다.
// API 연결 후에는 서버 응답을 data에 전달하면 같은 화면이 갱신됩니다.
export default function App() {
  // 주소 끝에 슬래시가 붙어도 같은 화면을 표시합니다.
  const path = window.location.pathname.replace(/\/+$/, "");
  const publicPage = path === "" || path === "/intro" || path === "/login";
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
    return <ReportPreview />;
  }

  const Page = pages.get(path);
  if (Page) {
    return <Page />;
  }

  return <Home data={sampleDashboardData} />;
}



// 같은 브라우저에서 다시 열어도 마지막 새로고침 시각을 유지
const reportRefreshKey = "butill:report-preview:last-refresh";

function readReportRefresh() {
  try {
    const refresh = JSON.parse(localStorage.getItem(reportRefreshKey));
    if (
      typeof refresh?.analysisDate === "string" &&
      typeof refresh.requestedAt === "string" &&
      Number.isFinite(Date.parse(refresh.requestedAt))
    ) {
      return refresh;
    }
  } catch {
    // 저장소를 사용할 수 없으면 초기 예시 데이터로 표시
  }
  return null;
}

function ReportPreview() {
  const [lastRefresh, setLastRefresh] = useState(readReportRefresh);
  const reportData = lastRefresh
    ? { ...sampleReportData, analysisDate: lastRefresh.analysisDate }
    : sampleReportData;

  // 백엔드 연결 시 기준일로 API를 조회하고, 성공한 응답과 갱신 시각을 화면에 전달
  async function refreshReport(analysisDate, requestedAt) {
    const refresh = { analysisDate, requestedAt };
    setLastRefresh(refresh);
    try {
      localStorage.setItem(reportRefreshKey, JSON.stringify(refresh));
    } catch {
      // 저장소를 사용할 수 없어도 현재 화면에는 갱신 결과를 표시
    }
  }

  return (
    <Report
      data={reportData}
      refreshedAt={lastRefresh?.requestedAt}
      onRefresh={refreshReport}
    />
  );
}
