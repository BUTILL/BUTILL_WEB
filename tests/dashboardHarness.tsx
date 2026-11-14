import { useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "../src/tsx/Home";
import { addMonths } from "../src/data/homeData";
import type { DashboardData } from "../src/data/homeData";
import { sampleDashboardData } from "../src/data/homeSample";
import "../src/css/index.css";
import "../src/css/App.css";

// 데이터 변경 시험 전용 화면입니다. 실제 앱에는 포함되지 않습니다.
function DashboardHarness() {
  const [data, setData] = useState<DashboardData | null>(sampleDashboardData);

  return (
    <>
      <div>
        <button id="reset-data" onClick={() => setData(sampleDashboardData)}>원래 데이터</button>
        <button id="change-income" onClick={() => setData({
          ...sampleDashboardData,
          monthlyCashFlows: sampleDashboardData.monthlyCashFlows.map((row, index) => ({
            ...row,
            income: index === 0 ? 100000000 : row.income,
          })),
        })}>수입 변경</button>
        <button id="change-start" onClick={() => setData({
          ...sampleDashboardData,
          startMonth: "2026-12",
          monthlyCashFlows: sampleDashboardData.monthlyCashFlows.map((row, index) => ({
            ...row,
            month: addMonths("2026-12", index),
          })),
        })}>시작 월 변경</button>
        <button id="missing-month" onClick={() => setData({
          ...sampleDashboardData,
          monthlyCashFlows: sampleDashboardData.monthlyCashFlows.slice(1),
        })}>첫 달 누락</button>
        <button id="empty-data" onClick={() => setData(null)}>데이터 없음</button>
      </div>
      <Home data={data} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<DashboardHarness />);


