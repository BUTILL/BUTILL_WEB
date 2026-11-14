import { useEffect } from "react";
import "../css/LandingPage.css";

const features = [
  {
    number: "01",
    title: "현금 흐름 상세 분석",
    description: "월별 매출·지출과 잔액 변화를 자세히 살펴봐요.",
  },
  {
    number: "02",
    title: "자금 시뮬레이션",
    description: "기본·낙관·비관 상황에 따른 자금 흐름을 비교해요.",
  },
  {
    number: "03",
    title: "원재료비 분석",
    description: "주요 식재료의 가격 변화와 매장 지출 영향을 확인해요.",
  },
  {
    number: "04",
    title: "세금 관리",
    description: "부가가치세와 원천세 등 주요 신고 일정을 살펴봐요.",
  },
];

export default function LandingPage({ showBack = false }: { showBack?: boolean }) {
  useEffect(() => {
    document.title = "BUTILL | 상세 분석 웹";
  }, []);

  // 웹 내부에서 들어왔으면 이전 화면으로, 직접 열었으면 홈으로 이동합니다.
  function goBack() {
    const previousPage = document.referrer ? new URL(document.referrer) : null;
    if (
      previousPage?.origin === window.location.origin &&
      previousPage.pathname.replace(/\/+$/, "") !== "/intro" &&
      window.history.length > 1
    ) {
      window.history.back();
      return;
    }
    window.location.assign("/home");
  }

  return (
    <main className="landing-page">
      {/* 첫 화면의 로고는 대시보드와 같은 상단바 여백을 사용합니다. */}
      <header className={showBack ? "landing-header" : "dashboard-header"}>
        {showBack && (
          <button className="landing-back-button" type="button" aria-label="뒤로가기" onClick={goBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
          </button>
        )}
        <span className={showBack ? "landing-brand" : "dashboard-logo"}>
          <img src="/figma/brand-source.png" alt="BUTILL" />
        </span>
        {!showBack && (
          <a className="landing-login-link" href="/login">
            로그인 <span aria-hidden="true">→</span>
          </a>
        )}
      </header>

      <div className="landing-content">
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <h1>
              앱에서는 간편하게,
              <br />
              웹에서는 <strong>자세하게.</strong>
            </h1>
            <p>
              앱에서 가게 정보를 입력하고,
              <br className="landing-desktop-break" />
              웹에서 복잡한 자금 흐름과 분석을 넓은 화면으로 살펴보세요.
            </p>
            <small className="landing-note">
              처음이라면 <a href="/signup">회원가입</a>하고 매장을 등록해 보세요. 앱과 같은 계정으로 로그인할 수 있어요.
            </small>
          </div>

          <aside className="landing-preview-stage" aria-label="웹 분석 화면 예시">
            <figure className="landing-device landing-browser">
              <div className="landing-browser-bar" aria-hidden="true">
                <span /><span /><span />
                <small>BUTILL · 시나리오별 가용자금 흐름</small>
              </div>
              <img
                src="/figma/landing-web-analysis.png"
                alt="웹에서 기본·낙관·비관 시나리오 그래프를 비교하는 분석 화면"
              />
              <figcaption>WEB · 자세한 분석</figcaption>
            </figure>
          </aside>
        </section>

        <section className="landing-features" aria-labelledby="landing-features-title">
          <div className="landing-section-heading">
            <div>
              <span className="landing-eyebrow">WEB DEEP ANALYSIS</span>
              <h2 id="landing-features-title">앱에서 입력한 정보를 더 깊게 분석해요</h2>
            </div>
            <p>복잡한 그래프와 일정은 웹에서 자세히 확인해보세요.</p>
          </div>
          <div className="landing-feature-grid">
            {features.map((feature) => (
              <article className="landing-feature-card" key={feature.number}>
                <span className="landing-feature-number">{feature.number}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

      </div>

      <footer className="landing-footer">
        <a className="landing-brand landing-brand-small" href="/intro" aria-label="BUTILL 서비스 소개">
          <img src="/figma/brand-source.png" alt="BUTILL" />
        </a>
        <span>가게 운영을 위한 자금 관리 서비스</span>
      </footer>
    </main>
  );
}
