import { ApiError, apiFetch } from "./client";
import { CHART_OPTIONS, RUNWAY_OPTIONS, withRecords, type MonthlyRecord, type RecordedAnalysis } from "./localAnalysis";
import type {
  Analysis, Comparison, Finances, IngredientCosts, IngredientPrices, Store, SupportPrograms, TaxSettings,
} from "./types";

export const OPTIMISTIC = { name: "낙관", sales_change_bps: 1500 };
export const PESSIMISTIC = { name: "비관", sales_change_bps: -1500, ingredient_change_bps: 800 };

// 한 계정의 첫 번째 매장을 웹 분석 대상으로 사용
export async function getCurrentStore(): Promise<Store | null> {
  const stores = await apiFetch<Store[]>("/api/v1/stores?limit=1");
  return stores[0] ?? null;
}

export async function createStore(store: Omit<Store, "id">): Promise<Store> {
  return apiFetch<Store>("/api/v1/stores", { method: "POST", body: store });
}

export async function getFinances(storeId: string): Promise<Finances | null> {
  try {
    return await apiFetch<Finances>(`/api/v1/stores/${storeId}/finances`);
  } catch (error) {
    if (error instanceof ApiError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}

export type StoreAnalysis = {
  store: Store | null;
  finances: Finances | null;
  analysis: Analysis | null; // 경영정보로 계산한 앞으로의 흐름
  recorded?: RecordedAnalysis | null; // 월별 실적이 있으면 실적 + 예측 12개월 (보고서·시나리오·캐시런웨이 판정)
  chart?: RecordedAnalysis | null; // 현금흐름 그래프용 12칸: 최근 실적(최대 6개월) + 예측(최소 6개월)
};

// 월별 실적. 실적 기능을 못 쓰는 상태(테이블 미생성 등)여도 기존 분석은 보여 주도록 빈 목록으로 돌린다
export async function getMonthlyRecords(storeId: string): Promise<MonthlyRecord[]> {
  try {
    const res = await apiFetch<{ records: (MonthlyRecord & { net_cashflow: number })[] }>(
      `/api/v1/stores/${storeId}/monthly-records`,
    );
    return res.records.map(({ month, sales, ingredient_cost, fixed_cost, irregular_cost }) =>
      ({ month, sales, ingredient_cost, fixed_cost, irregular_cost }));
  } catch (error) {
    if (error instanceof ApiError && error.status !== 401) return [];
    throw error;
  }
}

// 저장된 경영정보로 계산만 하고 이력은 남기지 않는다(미리보기). 월별 실적이 있으면 실적 뒤에 이어 붙인다
export async function loadStoreAnalysis(): Promise<StoreAnalysis> {
  const store = await getCurrentStore();
  if (!store) return { store, finances: null, analysis: null };
  const [finances, records] = await Promise.all([getFinances(store.id), getMonthlyRecords(store.id)]);
  if (!finances) return { store, finances, analysis: null };
  const analysis = await apiFetch<Analysis>("/api/v1/analyses/preview", { method: "POST", body: finances.input, auth: false });
  // 마지막 실적 달 말 잔액 = 경영정보의 현재 보유자금, 예비자금은 분석과 같은 기준
  const reserve = analysis.initial_cash - analysis.initial_available_cash;
  const recorded = withRecords(records, analysis.initial_cash, reserve, analysis.monthly, RUNWAY_OPTIONS);
  const chart = withRecords(records, analysis.initial_cash, reserve, analysis.monthly, CHART_OPTIONS);
  return { store, finances, analysis, recorded, chart };
}

export async function compareScenarios(finances: Finances): Promise<Comparison> {
  return apiFetch<Comparison>("/api/v1/scenarios/compare", {
    method: "POST", auth: false, body: { base: finances.input, scenarios: [OPTIMISTIC, PESSIMISTIC] },
  });
}

export type StoreComparison = { store: Store | null; comparison: Comparison | null };

export async function loadStoreComparison(): Promise<StoreComparison> {
  const store = await getCurrentStore();
  const finances = store ? await getFinances(store.id) : null;
  return { store, comparison: finances ? await compareScenarios(finances) : null };
}

export const getIngredientPrices = () => apiFetch<IngredientPrices>("/api/v1/ingredient-prices", { auth: false });

export type RawMaterialData = { prices: IngredientPrices; costs: IngredientCosts | null };

// 매장 원재료 단가(월 지출 영향)는 없어도 시세는 보여 준다
export async function loadRawMaterials(): Promise<RawMaterialData> {
  const [prices, store] = await Promise.all([getIngredientPrices(), getCurrentStore()]);
  const costs = store ? await getIngredientCosts(store.id).catch(() => null) : null;
  return { prices, costs };
}
export const getIngredientCosts = (storeId: string) => apiFetch<IngredientCosts>(`/api/v1/stores/${storeId}/ingredient-costs`);
export const getTaxSettings = (storeId: string) => apiFetch<TaxSettings>(`/api/v1/stores/${storeId}/tax-settings`);

export async function loadStoreTax(): Promise<{ store: Store | null; tax: TaxSettings | null }> {
  const store = await getCurrentStore();
  return { store, tax: store ? await getTaxSettings(store.id) : null };
}
export const getSupportPrograms = () => apiFetch<SupportPrograms>("/api/v1/support-programs", { auth: false });
