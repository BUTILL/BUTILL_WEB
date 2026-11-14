import Logout from "./Logout";
import { demoOnly, isDemo } from "../data/demo";
import "../css/Home.css";

type DashboardPage = "home" | "report" | "simulation" | "rawMaterials" | "tax" | "support";

export type DashboardHeaderProps = {
  logoSrc?: string;
  dashboardHref?: string;
  reportHref?: string;
  simulationHref?: string;
  rawMaterialsHref?: string;
  taxHref?: string;
  supportHref?: string;
  notificationsHref?: string;
};

// 대시보드와 상세 분석에서 같은 상단바를 쓰고 현재 화면을 표시합니다.
export default function DashboardHeader({
  activePage,
  logoSrc = "/figma/brand-source.png",
  dashboardHref = "/home",
  reportHref = "/report",
  simulationHref = "/simulation",
  rawMaterialsHref = "/raw-materials",
  taxHref = "/tax",
  supportHref = "/support",
}: DashboardHeaderProps & { activePage: DashboardPage }) {
  const links = [
    { key: "home", href: dashboardHref, label: "현금흐름 분석" },
    { key: "report", href: reportHref, label: "분석 보고서" },
    { key: "simulation", href: simulationHref, label: "자금 시뮬레이션" },
    { key: "rawMaterials", href: rawMaterialsHref, label: "원재료비 분석" },
    { key: "tax", href: taxHref, label: "세금 관리" },
    { key: "support", href: supportHref, label: "지원사업" },
  ];

  return (
    <header className="dashboard-header">
      <a className="dashboard-logo" href={dashboardHref} aria-label="BUTILL 웹 홈">
        <img src={logoSrc} alt="BUTILL" />
      </a>
      <nav aria-label="웹 메뉴">
        {links.map(({ key, href, label }) => (
          <a
            key={key}
            className={activePage === key ? "active" : undefined}
            href={href}
            aria-current={activePage === key ? "page" : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="dashboard-header-actions">
        {isDemo() && <span className="dashboard-demo-badge" title="예시 데이터로 둘러보는 중이에요">체험 모드</span>}
        {!demoOnly && <Logout />}
      </div>
    </header>
  );
}
