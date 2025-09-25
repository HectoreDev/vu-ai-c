export type InterestRate = "fha_30" | "conventional_30" | null;

export type BudgetType = {
  total_budget?: Range;
  down_payment?: number;
  interest_rate?: number;
  loan_duration?: number;
};

export type FloorplanSpecs = {
  sqft: Range;
  beds: Range;
  baths: Range;
  garage: Range;
};

export type Range = { min: number; max: number };
