import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import process from "node:process";
import { createServer } from "vite";
import { formatMoney } from "../src/data/homeData.ts";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/jiwon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const server = await createServer({ server: { host: "127.0.0.1", port: 4192, strictPort: true } });
let browser;

try {
  await server.listen();
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  await page.clock.setFixedTime(new Date('2026-11-09T03:00:00Z'));
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("http://127.0.0.1:4192/tests/dashboardHarness.html");
  await page.locator('[data-list-month="2026-07"]').waitFor();
  assert.equal(await page.locator('[data-chart-month]').count(), 12);
  assert.equal(await page.locator('[data-list-month]').count(), 6);
  assert.equal(await page.locator('[data-chart-month]').first().getAttribute('data-chart-month'), '2026-07');
  assert.equal(await page.locator('[data-chart-month]').last().getAttribute('data-chart-month'), '2027-06');
  assert.equal(await page.locator('.dashboard-chart-warning').getAttribute('data-risk-month'), '2027-03');

  assert.equal(await page.locator('[data-list-month]').last().getAttribute('data-list-month'), '2026-12');
  // 현재 표시는 오늘이 속한 11월, 강조는 마감된 10월
  const currentLabels = await page.locator('[data-chart-month="2026-11"] text').allTextContents();
  assert.deepEqual(currentLabels.map((label) => label.trim()), ['11월', '현재']);
  const dataLabels = await page.locator('[data-chart-month="2026-10"] text').allTextContents();
  assert.deepEqual(dataLabels.map((label) => label.trim()), ['10월']);
  assert.equal(await page.locator('[data-chart-month="2026-10"] text').first().getAttribute('font-weight'), '700');
  for (const series of ['income', 'expense']) {
    assert.equal(await page.locator(`[data-chart-month="2026-11"] [data-series="${series}"]`).getAttribute('fill-opacity'), '1');
    assert.equal(await page.locator(`[data-chart-month="2026-12"] [data-series="${series}"]`).getAttribute('fill-opacity'), '0.55');
  }

  const heightBefore = await page.locator('[data-series="income"]').first().getAttribute('height');
  const pointBefore = await page.locator('[data-balance-month]').first().getAttribute('cy');
  await page.locator('#change-income').click();
  await page.waitForFunction(() => !document.querySelector('.dashboard-chart-warning'));
  const heightAfter = await page.locator('[data-series="income"]').first().getAttribute('height');
  const pointAfter = await page.locator('[data-balance-month]').first().getAttribute('cy');
  assert.notEqual(heightBefore, heightAfter);
  assert.notEqual(pointBefore, pointAfter);
  assert.equal(await page.locator('.dashboard-closing dd').first().innerText(), formatMoney(107450000));
  assert.match(await page.locator('[data-balance-month]').first().textContent(), /1.07억원/);

  await page.locator('#change-start').click();
  await page.locator('[data-list-month="2026-12"]').waitFor();
  assert.equal(await page.locator('[data-chart-month]').first().getAttribute('data-chart-month'), '2026-12');
  assert.equal(await page.locator('[data-chart-month]').nth(1).getAttribute('data-chart-month'), '2027-01');
  assert.equal(await page.locator('[data-list-month]').last().getAttribute('data-list-month'), '2027-05');

  await page.locator('#missing-month').click();
  await page.waitForFunction(() => document.querySelector('[data-list-month]').textContent.includes('미입력'));
  assert.equal(await page.locator('[data-chart-month]').first().locator('rect[data-series]').count(), 0);
  assert.equal(await page.locator('[data-balance-month]').count(), 0);
  assert.equal(await page.locator('.dashboard-closing dd').first().innerText(), '확인 불가');

  await page.locator('#empty-data').click();
  await page.locator('.dashboard-empty').waitFor();
  assert.equal(await page.locator('[data-chart-month]').count(), 0);

  // 실제 홈 화면에서 PC 화면과 경고 박스 간격을 확인합니다.
  await mkdir('test-results', { recursive: true });
  await page.goto('http://127.0.0.1:4192/login');
  await page.locator('.web-login-demo-link').click();
  await page.waitForURL('http://127.0.0.1:4192/home');
  await page.locator('[data-chart-month]').first().waitFor();

  for (const [name, width, height] of [['desktop', 1440, 1100]]) {
    await page.setViewportSize({ width, height });
    const layout = await page.evaluate(() => {
      const warning = document.querySelector('.dashboard-chart-warning');
      const month = warning.getAttribute('data-risk-month');
      const bars = [...document.querySelector(`[data-chart-month="${month}"]`).querySelectorAll('[data-series]')].map((bar) => bar.getBoundingClientRect());
      return {
        gap: Math.min(...bars.map((bar) => bar.top)) - warning.getBoundingClientRect().bottom,
        alignment: warning.getBoundingClientRect().left - bars[0].left,
        pageWidth: document.documentElement.scrollWidth,
        logoLoaded: document.querySelector('.dashboard-logo img').naturalWidth > 0,
      };
    });
    assert.ok(Math.abs(layout.gap - 10) < 0.2, `Warning gap: ${layout.gap}`);
    assert.ok(Math.abs(layout.alignment) < 0.2);
    assert.ok(layout.pageWidth <= width);
    assert.ok(layout.logoLoaded);
    await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
    console.log(name, JSON.stringify(layout));
  }

  assert.deepEqual(errors, []);
  console.log('시작 월·금액 변경·누락 데이터·PC 화면 표시 확인 완료.');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  await server.close();
}

