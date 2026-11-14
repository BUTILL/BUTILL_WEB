import { useEffect } from "react";
import DashboardHeader from "./DashboardHeader";
import "../css/SimulationAnalysisWebPage.css";
import "../css/RawMaterialsAnalysisWebPage.css";

import { rawMaterialItems as items, type RawItem } from "../data/rawMaterials";

const formatPrice = (price: number) => "₩" + price.toLocaleString("ko-KR");
const weekLabels = ["4주 전", "3주 전", "2주 전", "1주 전", "이번 주"];
const weekTickIndexes = [0, 7, 14, 21, 27];
const chartX = (index: number) => 24 + (index * 232) / 27;

function PriceTrend({ item }: { item: RawItem }) {
  const min = Math.min(...item.dailyPrices) * 0.96;
  const max = Math.max(...item.dailyPrices) * 1.04;
  const points = item.dailyPrices.map((price, index) => ({
    price,
    x: chartX(index),
    y: 85 - ((price - min) / (max - min || 1)) * 62,
  }));
  const line = points
    .map(
      (point, index) => (index === 0 ? "M " : "L ") + point.x + " " + point.y,
    )
    .join(" ");

  return (
    <div className="raw-web-trend">
      <svg
        viewBox="0 0 280 112"
        role="img"
        aria-label={item.name + " 최근 28일 일별 단가 추이"}
      >
        <line x1="24" x2="256" y1="87" y2="87" className="raw-web-axis" />
        <line x1="24" x2="256" y1="55" y2="55" className="raw-web-grid" />
        <line x1="24" x2="256" y1="23" y2="23" className="raw-web-grid" />
        {weekTickIndexes.map((index) => (
          <line
            key={index}
            x1={chartX(index)}
            x2={chartX(index)}
            y1="20"
            y2="88"
            className="raw-web-week-divider"
          />
        ))}
        <path d={line} className={"raw-web-line " + item.type} />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={index === points.length - 1 ? 3.5 : 1.8}
            className={"raw-web-point " + item.type}
          >
            <title>
              {index === points.length - 1 ? "오늘" : `${27 - index}일 전`} ·{" "}
              {formatPrice(point.price)}
            </title>
          </circle>
        ))}
        {weekTickIndexes.map((index, labelIndex) => (
          <text
            key={weekLabels[labelIndex]}
            x={points[index].x}
            y="106"
            textAnchor="middle"
            className="raw-web-week-label"
          >
            {weekLabels[labelIndex]}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function RawMaterialsAnalysisWebPage() {
  const risingCount = items.filter((item) => item.type === "up").length;

  useEffect(() => {
    document.title = "BUTILL | 원재료비 상세 분석";
  }, []);

  return (
    <main className="analysis-web raw-web">
      <DashboardHeader activePage="rawMaterials" />

      <div className="analysis-container">
        <section className="analysis-hero">
          <div>
            <span className="analysis-kicker">BUTILL 원재료 시세</span>
            <h1>주요 원재료 가격 변화를 확인하세요</h1>
            <p>
              최근 4주 단가와 매장 지출 영향을 비교해 다음 발주를 준비할 수
              있어요.
            </p>
          </div>
          <span className="analysis-sample-tag">
            <i /> 화면 예시 데이터
          </span>
        </section>

        <section className="raw-web-metrics">
          <article>
            <span>추적 중인 원재료</span>
            <strong>5개 품목</strong>
            <small>주간 시세 예시</small>
          </article>
          <article>
            <span>이번 주 가격 상승</span>
            <strong>{risingCount}개 품목</strong>
            <small>관심 품목 중 상승 항목</small>
          </article>
          <article>
            <span>가장 큰 단가 상승</span>
            <strong className="raw-web-highlight">삼겹살 +8.2%</strong>
            <small>지난 주 대비 1kg 기준</small>
          </article>
        </section>

        <section className="raw-web-section-heading">
          <div>
            <span className="analysis-kicker">WEEKLY PRICE TRACKER</span>
            <h2>품목별 최근 4주 단가</h2>
          </div>
          <span>이번 주 기준</span>
        </section>

        <section className="raw-web-items">
          {items.map((item) => (
            <article className={"raw-web-card " + item.type} key={item.name}>
              <header className="raw-web-card-header">
                <div>
                  <h3>{item.name}</h3>
                  <span>{item.package}</span>
                </div>
                <strong className={"raw-web-change " + item.type}>
                  {item.type === "up" ? "▲" : item.type === "down" ? "▼" : "—"}{" "}
                  {item.change}
                </strong>
              </header>
              <div className="raw-web-prices">
                <div>
                  <span>지난 주</span>
                  <b>{formatPrice(item.previous)}</b>
                </div>
                <div>
                  <span>이번 주</span>
                  <b>{formatPrice(item.current)}</b>
                </div>
                <div>
                  <span>변동 금액</span>
                  <b className={"raw-web-delta " + item.type}>{item.delta}</b>
                </div>
              </div>
              <div className="raw-web-chart-title">
                <b>일별 단가 · 최근 4주 흐름</b>
              </div>
              <PriceTrend item={item} />
              <div className={"raw-web-impact " + item.type}>
                <span>예상 매장 월 지출 영향</span>
                <b>{item.monthlyImpact}</b>
              </div>
              <small className="raw-web-source">{item.source}</small>
            </article>
          ))}
        </section>

        <section className="raw-web-advice">
          <div className="raw-web-advice-mark">!</div>
          <div>
            <span className="analysis-kicker">BUTILL ACTION GUIDE</span>
            <h2>이번 주 대응 제안</h2>
            <p>
              삼겹살 단가가 지난 주보다 8.2% 올랐어요. 다음 발주를 나누어
              진행하거나 대체 부위의 가격을 함께 비교해 보세요.
            </p>
          </div>
        </section>

        <footer className="analysis-footer">
          <span>BUTILL</span>
          <span>시세와 지출 영향은 화면 예시 값입니다.</span>
        </footer>
      </div>
    </main>
  );
}
