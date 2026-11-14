import { useEffect, useState, type FormEvent } from "react";
import { loadStoreComparison } from "../api/butill";
import { toScenarios } from "../api/mappers";
import { useLoad } from "../api/useLoad";
import {
  scenarioMeta,
  type Scenario,
  type ScenarioAssumptions,
  type ScenarioKey,
} from "../data/simulation";
import DashboardHeader from "./DashboardHeader";
import "../css/SimulationAnalysisWebPage.css";

// 계산 조건이 백엔드 기준으로 바뀌어 예전 예시 메모와 섞이지 않도록 키를 바꿈
const assumptionStorageKey = "butill-simulation-assumptions-v2";

// 받은 가용자금(만원) 범위에 맞춰 세로축 눈금을 정한다
function chartScale(scenarios: Scenario[]) {
  const values = scenarios.flatMap((s) => s.fundsInTenThousands);
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values);
  const rough = (max - min) / 8;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((n) => n * magnitude).find((n) => n >= rough) ?? 10 * magnitude;
  const top = Math.ceil(max / step) * step;
  const bottom = Math.floor(min / step) * step;
  const ticks = Array.from({ length: Math.round((top - bottom) / step) + 1 }, (_, i) => top - i * step);
  return { ticks, chartY: (value: number) => 24 + ((top - value) / (top - bottom || 1)) * 220 };
}

const formatAxisTick = (value: number) =>
  value === 0 ? "0" : `${value < 0 ? "-" : ""}${(Math.abs(value) / 1000).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}천만`;

function AnalysisChart({ selectedKey, scenarios, months }: { selectedKey: ScenarioKey; scenarios: Scenario[]; months: string[] }) {
  const { ticks, chartY } = chartScale(scenarios);
  const lastIndex = Math.max(1, months.length - 1);
  const chartX = (index: number) => 58 + (index * 760) / lastIndex;
  return (
    <div className="analysis-chart">
      <svg
        viewBox="0 0 880 290"
        role="img"
        aria-label="기본·낙관·비관 시나리오별 월별 가용자금 그래프"
      >
        {ticks.map((tick) => {
          const y = chartY(tick);
          return (
            <g key={tick}>
              <line
                x1="58"
                x2="830"
                y1={y}
                y2={y}
                className={
                  tick === 0 ? "analysis-zero-line" : "analysis-gridline"
                }
              />
              <text
                x="44"
                y={y + 4}
                textAnchor="end"
                className="analysis-axis-label"
              >
                {formatAxisTick(tick)}
              </text>
            </g>
          );
        })}
        {months.map((month, index) => (
          <text
            key={`${month}-${index}`}
            x={chartX(index)}
            y="276"
            textAnchor="middle"
            className="analysis-month-label"
          >
            {month}
          </text>
        ))}
        {scenarios.map((item) => {
          const points = item.fundsInTenThousands.map(
            (value, index) => [chartX(index), chartY(value)] as const,
          );
          const line = points
            .map(([x, y], index) => `${index ? "L" : "M"} ${x} ${y}`)
            .join(" ");
          const isSelected = item.key === selectedKey;
          const zero = chartY(0);
          const last = points[points.length - 1];
          if (!last) return null;
          const area = `${line} L ${last[0]} ${zero} L ${points[0][0]} ${zero} Z`;

          return (
            <g key={item.key}>
              {isSelected && <path d={area} fill={item.color} opacity="0.07" />}
              <path
                d={line}
                fill="none"
                stroke={item.color}
                className={`analysis-line ${isSelected ? "selected" : "muted"}`}
              />
              <circle
                cx={last[0]}
                cy={last[1]}
                r={isSelected ? 5 : 4}
                fill={item.color}
                opacity={isSelected ? 1 : 0.28}
                stroke="#fff"
                strokeWidth="3"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// 받은 가용자금 흐름으로 그래프 위 한 줄 요약을 정함
function trendText(scenario: Scenario) {
  const funds = scenario.fundsInTenThousands;
  if (!funds.length) return "";
  if (funds.some((value) => value < 0)) return "자금 부족 주의";
  return funds[funds.length - 1] >= funds[0] ? "가용자금 증가 추세" : "가용자금 감소 추세";
}

function loadSavedAssumptions(): ScenarioAssumptions {
  const defaults = Object.fromEntries(
    scenarioMeta.map(({ key, assumptions }) => [key, assumptions]),
  ) as ScenarioAssumptions;

  try {
    const saved = localStorage.getItem(assumptionStorageKey);
    if (!saved) return defaults;

    const parsed = JSON.parse(saved) as Partial<ScenarioAssumptions>;
    return {
      basic: Array.isArray(parsed.basic)
        ? parsed.basic.filter((item): item is string => typeof item === "string")
        : defaults.basic,
      optimistic: Array.isArray(parsed.optimistic)
        ? parsed.optimistic.filter((item): item is string => typeof item === "string")
        : defaults.optimistic,
      pessimistic: Array.isArray(parsed.pessimistic)
        ? parsed.pessimistic.filter((item): item is string => typeof item === "string")
        : defaults.pessimistic,
    };
  } catch {
    return defaults;
  }
}

export default function SimulationAnalysisWebPage() {
  const [selectedKey, setSelectedKey] = useState<ScenarioKey>("basic");
  const [assumptions, setAssumptions] = useState<ScenarioAssumptions>(
    loadSavedAssumptions,
  );
  const [newAssumption, setNewAssumption] = useState("");
  const [state, reload] = useLoad(loadStoreComparison);
  const computed = state.status === "ready" && state.data.comparison ? toScenarios(state.data.comparison) : null;
  const scenarios: Scenario[] = computed?.scenarios
    ?? scenarioMeta.map((meta) => ({ ...meta, period: "—", fundsInTenThousands: [] }));
  const scenario =
    scenarios.find(({ key }) => key === selectedKey) ?? scenarios[0];
  const emptyMessage = state.status === "loading"
    ? "시나리오를 계산하는 중이에요."
    : state.status === "error"
      ? state.message
      : !state.data.store
        ? "등록된 매장이 없어요. 매장을 먼저 등록해 주세요."
        : "경영정보를 버틸 앱에서 입력하면 시나리오를 비교할 수 있어요.";

  useEffect(() => {
    document.title = "BUTILL | 시뮬레이션 상세 분석";
  }, []);

  useEffect(() => {
    localStorage.setItem(assumptionStorageKey, JSON.stringify(assumptions));
  }, [assumptions]);

  const updateAssumption = (index: number, value: string) => {
    setAssumptions((current) => ({
      ...current,
      [selectedKey]: current[selectedKey].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const removeAssumption = (index: number) => {
    setAssumptions((current) => ({
      ...current,
      [selectedKey]: current[selectedKey].filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const addAssumption = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = newAssumption.trim();
    if (!value) return;

    setAssumptions((current) => ({
      ...current,
      [selectedKey]: [...current[selectedKey], value],
    }));
    setNewAssumption("");
  };

  const applyExampleAssumptions = () => {
    setAssumptions((current) => ({
      ...current,
      [selectedKey]: [...scenario.assumptions],
    }));
  };

  return (
    <main className="analysis-web">
      <DashboardHeader activePage="simulation" />

      <div className="analysis-container">
        <section className="analysis-hero">
          <div>
            <span className="analysis-kicker">BUTILL 자금 진단</span>
            <h1>가게 상황별 자금 흐름을 자세히 살펴보세요</h1>
            <p>
              매출과 원재료비 변화에 따라 앞으로 사용할 수 있는 자금이 어떻게
              달라지는지 비교합니다.
            </p>
          </div>
          <span className="analysis-sample-tag">
            <i /> 앱 입력 경영정보 기준
          </span>
        </section>

        <section
          className="analysis-metrics"
          aria-label="시나리오별 예상 버틸 기간"
        >
          {[scenarios[0], scenarios[2], scenarios[1]].map((item) => (
            <article className={`scenario-metric ${item.key}`} key={item.key}>
              <span>{item.name}</span>
              <strong>{item.period}</strong>
              <small>{item.label}</small>
            </article>
          ))}
        </section>

        <section className="analysis-workspace">
          <article className="analysis-panel analysis-chart-panel">
            <div className="analysis-panel-heading">
              <div>
                <span className="analysis-kicker">SCENARIO COMPARISON</span>
                <h2>시나리오별 가용자금 흐름</h2>
                <p>입력한 경영정보로 계산한 월말 가용자금(현금 − 예비자금)입니다.</p>
              </div>
              <span className="analysis-period">{computed ? `${computed.months.length}개월 전망` : "전망"}</span>
            </div>
            <div
              className="analysis-tabs"
              role="tablist"
              aria-label="시나리오 선택"
            >
              {scenarios.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={selectedKey === item.key}
                  className={selectedKey === item.key ? "selected" : ""}
                  onClick={() => setSelectedKey(item.key)}
                >
                  <i style={{ background: item.color }} />
                  <span>
                    <b>{item.name}</b>
                    <small>{item.label}</small>
                  </span>
                </button>
              ))}
            </div>
            <div className="analysis-chart-heading">
              <strong>{scenario.name}</strong>
              <span>{trendText(scenario)}</span>
            </div>
            {computed ? (
              <AnalysisChart selectedKey={selectedKey} scenarios={scenarios} months={computed.months} />
            ) : (
              <div className="analysis-chart analysis-chart-empty" role="status">
                <p>{emptyMessage}</p>
                {state.status === "error" && (
                  <button type="button" onClick={() => reload().catch(() => undefined)}>다시 시도</button>
                )}
              </div>
            )}
            <div className="analysis-chart-footnote">
              <span>가용자금 (만원)</span>
              <span>※ 낙관: 매출 +15% · 비관: 매출 −15%, 원재료비 +8%</span>
            </div>
          </article>

          <aside className="analysis-panel analysis-summary-panel">
            <span className="analysis-kicker">SELECTED SCENARIO</span>
            <h2>{scenario.name}</h2>
            <p>{scenario.insight}</p>
            <div
              className="analysis-runway-box"
              style={{ background: scenario.tint, color: scenario.color }}
            >
              <span>예상 버틸 기간</span>
              <strong>{scenario.period}</strong>
              <small>{scenario.runwayNote ?? "경영정보 입력 후 계산돼요"}</small>
            </div>
            <div className="analysis-assumptions">
              <h3>시나리오 가정</h3>
              <p className="analysis-assumptions-help">
                이 시나리오에서 예상하는 상황을 직접 입력해 보세요.
              </p>
              <div className="analysis-assumptions-list">
                {assumptions[selectedKey].map((item, index) => (
                  <div
                    className="analysis-assumption-row"
                    key={`${selectedKey}-${index}`}
                  >
                    <input
                      aria-label={`시나리오 가정 ${index + 1}`}
                      value={item}
                      onChange={(event) =>
                        updateAssumption(index, event.target.value)
                      }
                      placeholder="예: 매출 10% 증가"
                    />
                    <button
                      type="button"
                      aria-label={`시나리오 가정 ${index + 1} 삭제`}
                      onClick={() => removeAssumption(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <form className="analysis-assumption-add" onSubmit={addAssumption}>
                <input
                  aria-label="새 시나리오 가정"
                  value={newAssumption}
                  onChange={(event) => setNewAssumption(event.target.value)}
                  placeholder="새 가정을 입력하세요"
                />
                <button type="submit">추가</button>
              </form>
              <button
                className="analysis-assumption-examples"
                type="button"
                onClick={applyExampleAssumptions}
              >
                계산 기준 가정 다시 적용
              </button>
            </div>
            <div className={`analysis-status ${scenario.key}`}>
              <i />
              <span>
                <b>
                  {scenario.key === "pessimistic"
                    ? "주의가 필요해요"
                    : scenario.key === "optimistic"
                      ? "흐름이 양호해요"
                      : "현재 추세를 확인하세요"}
                </b>
                <small>{scenario.insight}</small>
              </span>
            </div>
          </aside>
        </section>

        <section className="analysis-advice-heading">
          <div className="analysis-advice-icon">!</div>
          <div>
            <span className="analysis-kicker">BUTILL ACTION GUIDE</span>
            <h2>사장님을 위한 대응 제안</h2>
            <p>현재 상황에 맞는 항목부터 확인해 보세요.</p>
          </div>
        </section>
        <section className="analysis-advice-grid">
          <article>
            <span>01</span>
            <div>
              <h3>메뉴별 원가 확인</h3>
              <p>가격이 오른 재료와 메뉴별 원가를 함께 확인해 보세요.</p>
            </div>
            <b>원재료비</b>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>매출 흐름 점검</h3>
              <p>최근 매출 변화와 시간대별 운영 현황을 비교해 보세요.</p>
            </div>
            <b>매출</b>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>다가오는 지출 준비</h3>
              <p>세금과 고정 지출 일정을 확인하고 필요한 자금을 준비하세요.</p>
            </div>
            <b>지출</b>
          </article>
        </section>
        <footer className="analysis-footer">
          <span>BUTILL</span>
          <span>버틸 앱에 입력한 경영정보로 계산한 추정치입니다. 실제 결과와 다를 수 있어요.</span>
        </footer>
      </div>
    </main>
  );
}
