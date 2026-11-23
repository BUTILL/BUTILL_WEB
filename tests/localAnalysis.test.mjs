import assert from "node:assert/strict";
import test from "node:test";
import { CHART_OPTIONS, FORECAST_MONTHS, withRecords } from "../src/api/localAnalysis.ts";

const MANWON = 10_000;
const record = (month, sales = 2000) => ({
  month: `${month}-01`,
  sales: sales * MANWON,
  ingredient_cost: 600 * MANWON,
  fixed_cost: 1100 * MANWON,
  irregular_cost: 0,
});
const months = (from, count) => Array.from({ length: count }, (_, i) => {
  const [y, m] = from.split("-").map(Number);
  const d = new Date(y, m - 1 + i, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
});
const monthsOf = (analysis) => analysis.monthly.map((m) => m.month.slice(0, 7));

test("옵션 없이 부르면 실적 전체 + 예측 6개월을 유지한다", () => {
  const recorded = withRecords(months("2026-03", 9).map((m) => record(m)), 662 * MANWON, 66 * MANWON);
  assert.equal(recorded.forecastStart, 9);
  assert.equal(recorded.combined.monthly.length, 9 + FORECAST_MONTHS);
});

test("그래프용: 실적이 1개월이면 예측 11개월로 12칸을 채운다", () => {
  const chart = withRecords([record("2026-11")], 662 * MANWON, 66 * MANWON, [], CHART_OPTIONS);
  assert.equal(chart.forecastStart, 1);
  assert.equal(chart.combined.monthly.length, 12);
  assert.deepEqual([monthsOf(chart.combined)[0], monthsOf(chart.combined)[11]], ["2026-11", "2027-10"]);
});

test("그래프용: 실적이 4개월이면 4개월 전부터, 6개월이면 6개월 전부터 그린다", () => {
  const four = withRecords(months("2026-08", 4).map((m) => record(m)), 662 * MANWON, 66 * MANWON, [], CHART_OPTIONS);
  assert.deepEqual([four.forecastStart, four.combined.monthly.length, monthsOf(four.combined)[0]], [4, 12, "2026-08"]);
  const six = withRecords(months("2026-06", 6).map((m) => record(m)), 662 * MANWON, 66 * MANWON, [], CHART_OPTIONS);
  assert.deepEqual([six.forecastStart, six.combined.monthly.length, monthsOf(six.combined)[0]], [6, 12, "2026-06"]);
});

test("그래프용: 중간에 빈 달이 있으면 마지막으로 이어진 구간부터 그린다", () => {
  const records = [...months("2026-05", 2), ...months("2026-09", 3)].map((m) => record(m));
  const chart = withRecords(records, 662 * MANWON, 66 * MANWON, [], CHART_OPTIONS);
  assert.deepEqual([chart.forecastStart, monthsOf(chart.combined)[0]], [3, "2026-09"]);
});

test("그래프용: 실적이 6개월을 넘으면 최근 6개월 + 예측 6개월만 쓴다", () => {
  const chart = withRecords(months("2026-01", 11).map((m) => record(m)), 662 * MANWON, 66 * MANWON, [], CHART_OPTIONS);
  assert.equal(chart.forecastStart, 6);
  assert.equal(chart.combined.monthly.length, 12);
  assert.equal(monthsOf(chart.combined)[0], "2026-06");
});

test("그래프용: 마지막 실적 달의 월말 잔액은 실적 개수와 관계없이 현재 보유자금이다", () => {
  const records = months("2026-01", 11).map((m, i) => record(m, 1500 + i * 100));
  const full = withRecords(records, 662 * MANWON, 66 * MANWON);
  const chart = withRecords(records, 662 * MANWON, 66 * MANWON, [], CHART_OPTIONS);
  const lastActual = (r) => r.combined.monthly[r.forecastStart - 1].cash_balance;
  assert.equal(lastActual(full), 662 * MANWON);
  assert.equal(lastActual(chart), 662 * MANWON);
});
