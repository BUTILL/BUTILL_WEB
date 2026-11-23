import { useEffect, useState } from "react";
import { loadStoreAnalysis, type StoreAnalysis } from "../api/butill";
import { FORECAST_MONTHS } from "../api/localAnalysis";
import { todayKst } from "../api/mappers";
import {
  applyScenario,
  clampPct,
  describeAssumptions,
  type ScenarioAssumption,
} from "../api/scenarioEngine";
import type { Analysis } from "../api/types";
import { loadNothing, useLoad } from "../api/useLoad";
import { isDemo } from "../data/demo";
import { demoRecorded } from "../data/demoAnalysis";
import { scenarioMeta, type Scenario, type ScenarioKey } from "../data/simulation";
import DashboardHeader from "./DashboardHeader";
import "../css/SimulationAnalysisWebPage.css";

// 가정을 여러 개·월별로 넣을 수 있게 형식이 바뀌어 키를 바꿈
const assumptionStorageKey = "butill-simulation-assumptions-v4";

type PctKey = "salesPct" | "ingredientPct" | "fixedPct";
// 저장용 가정: 달은 "YYYY-MM-01"로 저장. from이 비면 첫 예측 월, to가 비면 마지막 달까지
type AssumptionItem = { id: string; from: string | null; to: string | null } & Record<PctKey, number>;
type AssumptionSet = Record<ScenarioKey, AssumptionItem[]>;

const newId = () => Math.random().toString(36).slice(2, 10);

// 낙관·비관은 첫 예측 월부터 적용
const defaultAssumptions = (): AssumptionSet => ({
  basic: [],
  optimistic: [{ id: "opt-1", from: null, to: null, salesPct: 15, ingredientPct: 0, fixedPct: 0 }],
  pessimistic: [{ id: "pes-1", from: null, to: null, salesPct: -15, ingredientPct: 8, fixedPct: 0 }],
});

const assumptionFields: { key: PctKey; label: string; hint: string }[] = [
  { key: "salesPct", label: "매출", hint: "늘면 +, 줄면 −" },
  { key: "ingredientPct", label: "원재료비", hint: "오르면 +" },
  { key: "fixedPct", label: "고정비", hint: "오르면 +" },
];

const isMonth = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-01$/.test(value);

function loadSavedAssumptions(): AssumptionSet {
  const defaults = defaultAssumptions();
  try {
    const parsed = JSON.parse(localStorage.getItem(assumptionStorageKey) ?? "null");
    if (!parsed) return defaults;
    const read = (key: ScenarioKey): AssumptionItem[] => {
      if (!Array.isArray(parsed[key])) return defaults[key];
      return parsed[key].slice(0, 20).map((item: Record<string, unknown>) => ({
        id: typeof item.id === "string" ? item.id : newId(),
        from: isMonth(item.from) ? item.from : null,
        to: isMonth(item.to) ? item.to : null,
        salesPct: clampPct(Number(item.salesPct ?? 0)),
        ingredientPct: clampPct(Number(item.ingredientPct ?? 0)),
        fixedPct: clampPct(Number(item.fixedPct ?? 0)),
      }));
    };
    return { basic: read("basic"), optimistic: read("optimistic"), pessimistic: read("pessimistic") };
  } catch {
    return defaults;
  }
}

// 월별 실적이 없을 때 예측이 시작되는 달: 이번 달부터
function forecastStartOf(analysis: Analysis): number {
  const thisMonth = `${todayKst().slice(0, 7)}-01`;
  const index = analysis.monthly.findIndex((m) => m.month >= thisMonth);
  return index < 0 ? analysis.monthly.length : index;
}

// 저장된 달을 분석 월 순번으로 바꾼다. 분석 범위 밖이면 가까운 끝으로 맞춘다
function toIndices(item: AssumptionItem, monthKeys: string[], forecastStart: number): ScenarioAssumption {
  const last = Math.max(0, monthKeys.length - 1);
  const indexOf = (month: string) => {
    const found = monthKeys.indexOf(month);
    if (found >= 0) return found;
    return month < (monthKeys[0] ?? "") ? 0 : last;
  };
  const startIndex = item.from ? indexOf(item.from) : Math.min(forecastStart, last);
  const endIndex = item.to ? Math.max(startIndex, indexOf(item.to)) : null;
  return { salesPct: item.salesPct, ingredientPct: item.ingredientPct, fixedPct: item.fixedPct, startIndex, endIndex };
}

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

// 눈금 단위는 만원. 1천만 미만은 "500만", 그 이상은 "1.5천만"처럼 표시
const formatAxisTick = (value: number) => {
  if (value === 0) return "0";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  return abs < 1000
    ? `${sign}${abs.toLocaleString("ko-KR")}만`
    : `${sign}${(abs / 1000).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}천만`;
};

function AnalysisChart({
  selectedKey,
  scenarios,
  months,
  forecastStart,
  assumptionStarts,
}: {
  selectedKey: ScenarioKey;
  scenarios: Scenario[];
  months: string[];
  forecastStart: number;
  assumptionStarts: { index: number; label: string }[];
}) {
  const { ticks, chartY } = chartScale(scenarios);
  const lastIndex = Math.max(1, months.length - 1);
  const chartX = (index: number) => 58 + (index * 760) / lastIndex;
  const halfStep = 380 / lastIndex;
  // 선택한 시나리오를 맨 위에 그린다
  const ordered = [...scenarios].sort((a, b) => Number(a.key === selectedKey) - Number(b.key === selectedKey));
  return (
    <div className="analysis-chart">
      <svg viewBox="0 0 880 290" role="img" aria-label="기본·낙관·비관 시나리오별 월별 가용자금 그래프">
        {forecastStart < months.length && (
          <g>
            <rect
              x={Math.max(48, chartX(forecastStart) - halfStep)}
              y="20"
              width={840 - Math.max(48, chartX(forecastStart) - halfStep)}
              height="228"
              className="analysis-forecast-zone"
            />
            <text x={836} y="16" textAnchor="end" className="analysis-forecast-label">예측</text>
          </g>
        )}
        {ticks.map((tick) => {
          const y = chartY(tick);
          return (
            <g key={tick}>
              <line x1="58" x2="830" y1={y} y2={y} className={tick === 0 ? "analysis-zero-line" : "analysis-gridline"} />
              <text x="44" y={y + 4} textAnchor="end" className="analysis-axis-label">
                {formatAxisTick(tick)}
              </text>
            </g>
          );
        })}
        {assumptionStarts.map(({ index, label }, order) => (
          <g key={index}>
            <line x1={chartX(index)} x2={chartX(index)} y1="20" y2="248" className="analysis-start-line" />
            <text x={chartX(index) + 4} y={32 + (order % 2) * 13} className="analysis-start-label">{label}</text>
          </g>
        ))}
        {months.map((month, index) => (
          <text
            key={`${month}-${index}`}
            x={chartX(index)}
            y="276"
            textAnchor="middle"
            className={`analysis-month-label${index >= forecastStart ? " forecast" : ""}`}
          >
            {month}
          </text>
        ))}
        {ordered.map((item) => {
          const points = item.fundsInTenThousands.map((value, index) => [chartX(index), chartY(value)] as const);
          if (!points.length) return null;
          const line = points.map(([x, y], index) => `${index ? "L" : "M"} ${x} ${y}`).join(" ");
          const isSelected = item.key === selectedKey;
          const zero = chartY(0);
          const last = points[points.length - 1];
          const area = `${line} L ${last[0]} ${zero} L ${points[0][0]} ${zero} Z`;

          return (
            <g key={item.key}>
              {isSelected && <path d={area} fill={item.color} opacity="0.07" />}
              <path
                d={line}
                fill="none"
                stroke={item.color}
                strokeLinejoin="round"
                className={`analysis-line ${isSelected ? "selected" : "muted"}`}
              />
              {points.map(([x, y], index) => (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={isSelected ? (index === points.length - 1 ? 5 : 3.5) : index === points.length - 1 ? 4 : 0}
                  fill={item.color}
                  opacity={isSelected ? 1 : 0.28}
                  stroke="#fff"
                  strokeWidth={isSelected ? 2 : 3}
                >
                  <title>{`${item.name} ${months[index]} ${item.fundsInTenThousands[index].toLocaleString("ko-KR")}만원`}</title>
                </circle>
              ))}
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

// 입력 중인 글자("-", "" 등)는 그대로 두고, 숫자로 읽히는 순간에만 계산에 반영한다
function PercentInput({ label, value, onCommit }: { label: string; value: number; onCommit: (value: number) => void }) {
  const [text, setText] = useState(String(value));
  const [shown, setShown] = useState(value);
  // 되돌리기 버튼처럼 바깥에서 값이 바뀌면 입력란 글자도 맞춘다
  if (shown !== value) {
    setShown(value);
    if (Number(text) !== value) setText(String(value));
  }
  return (
    <input
      type="text"
      inputMode="numeric"
      aria-label={`${label} (%)`}
      value={text}
      onChange={(event) => {
        const next = event.target.value.replace(/[^0-9+-]/g, "");
        setText(next);
        if (/^[+-]?\d+$/.test(next)) {
          const clamped = clampPct(Number(next));
          if (clamped !== value) onCommit(clamped);
        }
      }}
      onBlur={() => setText(String(value))}
    />
  );
}

export default function SimulationAnalysisWebPage() {
  const [selectedKey, setSelectedKey] = useState<ScenarioKey>("basic");
  const [assumptions, setAssumptions] = useState(loadSavedAssumptions);
  const demo = isDemo();
  const [state, reload] = useLoad<StoreAnalysis | null>(demo ? loadNothing : loadStoreAnalysis);
  // 체험·로그인 모두 "실적 + 예측 12개월"(withRecords)로 버틸 기간을 계산하고, 그래프는 예측 6개월까지만 그린다.
  // 로그인인데 실적이 없으면 경영정보 예측만 그린다
  const recorded = demo ? demoRecorded : state.status === "ready" ? state.data?.recorded ?? null : null;
  const analysis = recorded?.combined ?? (state.status === "ready" ? state.data?.analysis ?? null : null);
  const monthKeys = analysis?.monthly.map((m) => m.month) ?? [];
  const months = monthKeys.map((m) => `${Number(m.slice(5, 7))}월`);
  const forecastStart = recorded ? recorded.forecastStart : analysis ? forecastStartOf(analysis) : 0;
  const indicesOf = (key: ScenarioKey) => assumptions[key].map((item) => toIndices(item, monthKeys, forecastStart));

  const scenarios: Scenario[] = scenarioMeta.map((meta) => {
    if (!analysis) return { ...meta, period: "—", fundsInTenThousands: [] };
    const list = indicesOf(meta.key);
    const result = applyScenario(analysis, list, recorded ? recorded.forecastStart : 0);
    return {
      ...meta,
      period: result.period,
      runwayNote: result.runwayNote,
      fundsInTenThousands: result.funds,
      assumptions: [describeAssumptions(list, months)],
    };
  });
  // 그래프 표시 범위: 실적 + 예측 6개월 (버틸 기간·추세 문구는 위의 12개월 계산 그대로)
  const chartEnd = recorded ? Math.min(months.length, forecastStart + FORECAST_MONTHS) : months.length;
  const chartMonths = months.slice(0, chartEnd);
  const chartScenarios = scenarios.map((item) => ({ ...item, fundsInTenThousands: item.fundsInTenThousands.slice(0, chartEnd) }));
  const scenario = scenarios.find(({ key }) => key === selectedKey) ?? scenarios[0];
  const items = assumptions[selectedKey];
  const resolved = indicesOf(selectedKey);
  // 그래프 점선: 값이 있는 가정만, 시작 월이 같으면 "가정 1·2"처럼 묶는다
  const startGroups = new Map<number, number[]>();
  resolved.forEach((a, order) => {
    if (!a.salesPct && !a.ingredientPct && !a.fixedPct) return;
    startGroups.set(a.startIndex, [...(startGroups.get(a.startIndex) ?? []), order + 1]);
  });
  const assumptionStarts = analysis
    ? [...startGroups].sort(([a], [b]) => a - b)
      .filter(([index]) => index < chartEnd)
      .map(([index, numbers]) => ({ index, label: `가정 ${numbers.join("·")}` }))
    : [];
  const emptyMessage = state.status === "loading"
    ? "시나리오를 계산하는 중이에요."
    : state.status === "error"
      ? state.message
      : !state.data?.store
        ? "등록된 매장이 없어요. 매장을 먼저 등록해 주세요."
        : "경영정보를 버틸 앱에서 입력하면 시나리오를 비교할 수 있어요.";

  useEffect(() => {
    document.title = "BUTILL | 시뮬레이션 상세 분석";
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(assumptionStorageKey, JSON.stringify(assumptions));
    } catch {
      // 저장소를 쓸 수 없어도 현재 화면에서는 계산
    }
  }, [assumptions]);

  const updateItem = (id: string, patch: Partial<AssumptionItem>) => {
    setAssumptions((all) => ({
      ...all,
      [selectedKey]: all[selectedKey].map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, ...patch };
        // 시작 월을 끝 월보다 뒤로 옮기면 끝 월을 시작 월에 맞춘다
        if (next.from && next.to && next.to < next.from) next.to = next.from;
        return next;
      }),
    }));
  };

  const addItem = () => {
    const from = monthKeys[Math.min(forecastStart, Math.max(0, monthKeys.length - 1))] ?? null;
    setAssumptions((all) => ({
      ...all,
      [selectedKey]: [...all[selectedKey], { id: newId(), from, to: null, salesPct: 0, ingredientPct: 0, fixedPct: 0 }],
    }));
  };

  const removeItem = (id: string) => {
    setAssumptions((all) => ({ ...all, [selectedKey]: all[selectedKey].filter((item) => item.id !== id) }));
  };

  return (
    <main className="analysis-web">
      <DashboardHeader activePage="simulation" />

      <div className="analysis-container">
        <section className="analysis-hero">
          <div>
            <span className="analysis-kicker">BUTILL 자금 진단</span>
            <h1>가게 상황별 자금 흐름을 자세히 살펴보세요</h1>
            <p>매출과 원재료비 변화에 따라 앞으로 사용할 수 있는 자금이 어떻게 달라지는지 비교합니다.</p>
          </div>
          <span className="analysis-sample-tag">
            <i /> {demo ? "체험용 예시 데이터" : "앱 입력 경영정보 기준"}
          </span>
        </section>

        <section className="analysis-metrics" aria-label="시나리오별 예상 버틸 기간">
          {[scenarios[0], scenarios[2], scenarios[1]].map((item) => (
            <article className={`scenario-metric ${item.key}`} key={item.key}>
              <span>{item.name}</span>
              <strong>{item.period}</strong>
              <small>{item.assumptions[0] ?? item.label}</small>
            </article>
          ))}
        </section>

        <section className="analysis-workspace">
          <article className="analysis-panel analysis-chart-panel">
            <div className="analysis-panel-heading">
              <div>
                <span className="analysis-kicker">SCENARIO COMPARISON</span>
                <h2>시나리오별 가용자금 흐름</h2>
                <p>월말 가용자금(현금 − 예비자금)입니다. 색칠된 구간은 앞으로의 예측이에요.</p>
              </div>
              <span className="analysis-period">
                {analysis
                  ? forecastStart > 0 && forecastStart < chartMonths.length
                    ? `${chartMonths[0]}~${chartMonths[forecastStart - 1]} 실제 · ${chartMonths.length - forecastStart}개월 예측`
                    : `${chartMonths[0]}부터 ${chartMonths.length}개월`
                  : "전망"}
              </span>
            </div>
            <div className="analysis-tabs" role="tablist" aria-label="시나리오 선택">
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
            {analysis ? (
              <AnalysisChart
                selectedKey={selectedKey}
                scenarios={chartScenarios}
                months={chartMonths}
                forecastStart={forecastStart}
                assumptionStarts={assumptionStarts}
              />
            ) : (
              <div className="analysis-chart analysis-chart-empty" role="status">
                <p>{emptyMessage}</p>
                {state.status === "error" && (
                  <button type="button" onClick={() => reload().catch(() => undefined)}>다시 시도</button>
                )}
              </div>
            )}
            <div className="analysis-chart-footnote">
              <span>가용자금 (만원) · 점선(0) 아래는 부족한 달</span>
              <span>※ {scenario.name}: {scenario.assumptions[0] ?? "—"}</span>
            </div>
          </article>

          <aside className="analysis-panel analysis-summary-panel">
            <span className="analysis-kicker">SELECTED SCENARIO</span>
            <h2>{scenario.name}</h2>
            <p>{scenario.insight}</p>
            <div className="analysis-runway-box" style={{ background: scenario.tint, color: scenario.color }}>
              <span>예상 버틸 기간</span>
              <strong>{scenario.period}</strong>
              <small>{scenario.runwayNote ?? "경영정보 입력 후 계산돼요"}</small>
            </div>
            <div className="analysis-assumptions">
              <h3>시나리오 가정</h3>
              <p className="analysis-assumptions-help">
                기간과 변화율을 넣으면 그래프와 버틸 기간에 바로 적용돼요. 기간이 겹치면 %가 더해져요.
              </p>
              {items.length === 0 && (
                <p className="analysis-assumption-empty">가정이 없어요. 지금 경영정보 그대로 계산합니다.</p>
              )}
              <ol className="analysis-assumption-cards">
                {items.map((item, order) => {
                  const range = resolved[order];
                  return (
                    <li className="analysis-assumption-card" key={item.id}>
                      <div className="analysis-assumption-card-head">
                        <b>가정 {order + 1}</b>
                        <button type="button" aria-label={`가정 ${order + 1} 삭제`} onClick={() => removeItem(item.id)}>
                          삭제
                        </button>
                      </div>
                      <div className="analysis-assumption-months">
                        <select
                          aria-label={`가정 ${order + 1} 시작 월`}
                          value={range ? monthKeys[range.startIndex] ?? "" : ""}
                          disabled={!monthKeys.length}
                          onChange={(event) => updateItem(item.id, { from: event.target.value })}
                        >
                          {monthKeys.map((key, index) => (
                            <option key={key} value={key}>{months[index]}{index >= forecastStart ? "" : " (실제)"}</option>
                          ))}
                        </select>
                        <span>~</span>
                        <select
                          aria-label={`가정 ${order + 1} 끝 월`}
                          value={range?.endIndex == null ? "" : monthKeys[range.endIndex]}
                          disabled={!monthKeys.length}
                          onChange={(event) => updateItem(item.id, { to: event.target.value || null })}
                        >
                          <option value="">끝까지</option>
                          {monthKeys.map((key, index) =>
                            range && index >= range.startIndex ? <option key={key} value={key}>{months[index]}</option> : null,
                          )}
                        </select>
                      </div>
                      <div className="analysis-assumption-pcts">
                        {assumptionFields.map((field) => (
                          <label key={field.key}>
                            <span>
                              {field.label}
                              <small>{field.hint}</small>
                            </span>
                            <span className="analysis-assumption-input">
                              <PercentInput
                                label={`가정 ${order + 1} ${field.label}`}
                                value={item[field.key]}
                                onCommit={(value) => updateItem(item.id, { [field.key]: value })}
                              />
                              %
                            </span>
                          </label>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ol>
              <button className="analysis-assumption-add-button" type="button" onClick={addItem} disabled={!analysis}>
                + 가정 추가
              </button>
              <p className="analysis-assumption-summary">{scenario.assumptions[0] ?? "—"}</p>
              <button
                className="analysis-assumption-examples"
                type="button"
                onClick={() => setAssumptions((all) => ({ ...all, [selectedKey]: defaultAssumptions()[selectedKey] }))}
              >
                기본 가정으로 되돌리기
              </button>
            </div>
            <div className={`analysis-status ${scenario.key}`}>
              <i />
              <span>
                <b>
                  {scenario.fundsInTenThousands.some((v) => v < 0)
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

        <section className="analysis-guide" aria-labelledby="analysis-guide-title">
          <span className="analysis-kicker">HOW TO USE</span>
          <h2 id="analysis-guide-title">시나리오 가정, 이렇게 입력하세요</h2>
          <ol>
            <li>
              <b>위에서 시나리오를 고르세요.</b>
              <p>기본은 지금 입력한 경영정보 그대로, 낙관은 좋아질 때, 비관은 나빠질 때를 가정해요.</p>
            </li>
            <li>
              <b>바뀔 것 같은 만큼 %로 적으세요.</b>
              <p>늘어나면 +, 줄어들면 −예요. 손님이 10% 줄 것 같으면 매출에 <code>-10</code>을 적어요.</p>
            </li>
            <li>
              <b>언제부터 언제까지인지 고르세요.</b>
              <p>시작 월부터 그래프가 꺾여요. 끝 월을 "끝까지"로 두면 계속, 특정 달을 고르면 그 달까지만 적용돼요.</p>
            </li>
            <li>
              <b>상황이 여러 개면 가정을 추가하세요.</b>
              <p>"+ 가정 추가"로 달마다 다른 변화를 넣을 수 있어요. 기간이 겹치는 달은 %가 더해져요.</p>
            </li>
            <li>
              <b>버틸 기간을 확인하세요.</b>
              <p>그래프가 점선(0원) 아래로 내려가는 달부터 자금이 부족해요. 그 전에 지출을 줄이거나 자금을 준비하세요.</p>
            </li>
          </ol>
          <div className="analysis-guide-examples">
            <span>이럴 땐 이렇게</span>
            <p>겨울 비수기 매출 감소 → <b>12월~2월, 매출 -15</b></p>
            <p>재료값이 계속 오를 것 같다 → <b>1월~끝까지, 원재료비 +10</b></p>
            <p>설 상여금이 나간다 → <b>2월~2월, 고정비 +30</b></p>
          </div>
        </section>

        <footer className="analysis-footer">
          <span>BUTILL</span>
          <span>
            {demo
              ? "체험용 예시 데이터로 계산한 화면입니다. 12월 이후는 최근 3개월 평균으로 예측했어요."
              : "버틸 앱에 입력한 경영정보로 계산한 추정치입니다. 실제 결과와 다를 수 있어요."}
          </span>
        </footer>
      </div>
    </main>
  );
}
