export type InterestRate = "fha_30" | "conventional_30" | null;

export type BudgetType = {
  total_budget?: Range;
  down_payment?: number;
  interest_rate?: number;
  loan_duration?: number;
};

export type FloorplanSpecs = {
  square_footage?: Range;
  bedroom_count?: Range;
  bathroom_count?: Range;
  garage_size?: Range;
};

export type Range = { min: number; max: number };
