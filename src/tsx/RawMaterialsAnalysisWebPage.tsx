import { useEffect } from "react";
import { loadRawMaterials } from "../api/butill";
import { toRawItems } from "../api/mappers";
import { useLoad } from "../api/useLoad";
import DashboardHeader from "./DashboardHeader";
import "../css/SimulationAnalysisWebPage.css";
import "../css/RawMaterialsAnalysisWebPage.css";

import type { RawItem } from "../data/rawMaterials";

const formatPrice = (price: number) => "₩" + price.toLocaleString("ko-KR");
const shortDate = (date: string) => `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`;

function PriceTrend({ item }: { item: RawItem }) {
  // 조사일만 점으로 찍고, 눈금은 처음·끝 포함 5개 조사일 날짜로 표시
  const lastIndex = Math.max(1, item.dailyPrices.length - 1);
  const chartX = (index: number) => 24 + (index * 232) / lastIndex;
  const weekTickIndexes = [...new Set([0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(r * lastIndex)))];
  const weekLabels = weekTickIndexes.map((index) => item.dailyDates?.[index] ? shortDate(item.dailyDates[index]) : "");
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
              {item.dailyDates?.[index] ? shortDate(item.dailyDates[index]) : ""} · {formatPrice(point.price)}
            </title>
          </circle>
        ))}
        {weekTickIndexes.map((index, labelIndex) => (
          <text
            key={`${index}-${labelIndex}`}
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
  const [state, reload] = useLoad(loadRawMaterials);
  const items = state.status === "ready" ? toRawItems(state.data.prices, state.data.costs) : [];
  const risingCount = items.filter((item) => item.type === "up").length;
  const topRise = items.filter((item) => item.type === "up").sort((a, b) => (b.bps ?? 0) - (a.bps ?? 0))[0];
  const usesStoreItems = Boolean(state.status === "ready" && state.data.costs?.items.length);
  const stale = state.status === "ready" && state.data.prices.stale;

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
            <i /> {stale ? "최신 시세 수집 지연" : "KAMIS 서울 소매 시세"}
          </span>
        </section>

        <section className="raw-web-metrics">
          <article>
            <span>추적 중인 원재료</span>
            <strong>{items.length}개 품목</strong>
            <small>{usesStoreItems ? "매장에 등록한 원재료" : "공통 주요 원재료"}</small>
          </article>
          <article>
            <span>이번 주 가격 상승</span>
            <strong>{risingCount}개 품목</strong>
            <small>1주 전 대비 상승 항목</small>
          </article>
          <article>
            <span>가장 큰 단가 상승</span>
            <strong className="raw-web-highlight">{topRise ? `${topRise.name} ${topRise.change}` : "상승 품목 없음"}</strong>
            <small>{topRise ? `지난 주 대비 ${topRise.package} 기준` : "1주 전 대비"}</small>
          </article>
        </section>

        {state.status !== "ready" && (
          <section className="raw-web-advice" role="status">
            <div className="raw-web-advice-mark">!</div>
            <div>
              <h2>{state.status === "loading" ? "원재료 시세를 불러오는 중이에요" : "원재료 시세를 불러오지 못했어요"}</h2>
              <p>{state.status === "error" ? state.message : "잠시만 기다려 주세요."}</p>
              {state.status === "error" && (
                <button type="button" onClick={() => reload().catch(() => undefined)}>다시 시도</button>
              )}
            </div>
          </section>
        )}

        <section className="raw-web-section-heading">
          <div>
            <span className="analysis-kicker">WEEKLY PRICE TRACKER</span>
            <h2>품목별 최근 4주 단가</h2>
          </div>
          <span>최근 조사일 기준</span>
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
              {topRise
                ? `${topRise.name} 단가가 지난 주보다 ${topRise.change.replace("+", "")} 올랐어요. 다음 발주를 나누어 진행하거나 대체 재료의 가격을 함께 비교해 보세요.`
                : "지난 주보다 크게 오른 원재료가 없어요. 평소 발주 계획을 유지해도 좋아요."}
              {!usesStoreItems && " 버틸 앱에서 원재료별 월 사용금액을 입력하면 매장 지출 영향도 계산돼요."}
            </p>
          </div>
        </section>

        <footer className="analysis-footer">
          <span>BUTILL</span>
          <span>시세는 서울 조사 시장 평균이며 참고 정보예요. 매장 식재료비에 자동 반영되지 않아요.</span>
        </footer>
      </div>
    </main>
  );
}
