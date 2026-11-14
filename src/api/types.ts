// 백엔드(BUTILL_BE) 응답 형식. 금액은 원 단위 정수, 날짜는 YYYY-MM-DD
export type Store = {
  id: string;
  name: string;
  business_type: "restaurant" | "cafe";
  region: string;
  status: "planning" | "operating";
};

export type Finances = { store_id: string; revision: string; input: Record<string, unknown> };

export type Runway = {
  initial_balance: number;
  first_depletion_month: string | null;
  first_shortage_month: string | null;
  shortage_amount: number;
  full_months_before_shortage: number | null;
  status: "shortage" | "depleted" | "no_shortage_in_period";
};

export type AnalysisMonth = {
  month: string;
  sales: number;
  ingredient_cost: number;
  fixed_cost: number;
  irregular_cost: number;
  net_cashflow: number;
  cash_balance: number;
  available_balance: number;
};

export type Analysis = {
  start_month: string;
  months: number;
  initial_cash: number;
  initial_available_cash: number;
  cash_runway: Runway;
  available_runway: Runway;
  monthly: AnalysisMonth[];
  risks: { code: string; month: string; amount: number; message: string }[];
  warnings: string[];
};

export type Comparison = {
  base: Analysis;
  scenarios: { name: string; analysis: Analysis }[];
};

export type DailyPrice = { price_date: string; average_price: number; average_price_per_kg: number | null; market_count: number };

export type PriceSummary = {
  key: string;
  name: string;
  groups: string[];
  status: "success" | "no_data" | "failed";
  stale: boolean;
  kind_name: string | null;
  rank_name: string | null;
  unit: string | null;
  latest: DailyPrice | null;
  week_change: { base_date: string; base_price: number; latest_price: number; change_amount: number; change_bps: number } | null;
  daily: DailyPrice[];
};

export type IngredientPrices = { status: string; stale: boolean; collected_at: string | null; items: PriceSummary[] };

export type IngredientCost = {
  price_key: string;
  name: string;
  monthly_amount: number | null;
  monthly_impact: number | null;
};

export type IngredientCosts = { items: IngredientCost[]; total_monthly_impact: number };

export type TaxSettings = {
  settings: {
    business_entity: "individual" | "corporation" | "unregistered" | "unknown";
    tax_type: "general" | "simple" | "unknown";
    filing_method: "self" | "accountant" | "undecided";
    employees: "yes" | "no" | "pending";
  };
  saved: boolean;
  schedule: { code: string; title: string; due_date: string; days_left: number; note: string | null }[];
  basis: string;
};

export type SupportProgram = {
  program_id: string;
  title: string;
  agency: string | null;
  summary: string | null;
  target: string | null;
  category: string | null;
  apply_end: string | null;
  apply_period_text: string | null;
  always_open: boolean;
  url: string | null;
};

export type SupportPrograms = { status: "success" | "failed"; programs: SupportProgram[] };
