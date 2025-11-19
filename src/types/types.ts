export type InterestRate = "fha_30" | "conventional_30" | null;

export type Lang = "es" | "en";
export interface IFLocation {
  state: string;
  location?: string;
  zip?: string;
}

export interface BudgetType {
  price?: {
    priceMin: number;
    priceMax: number;
  };
  total_budget?: Range;
  down_payment?: number;
  interest_rate?: number;
  loan_duration?: number;
}

export interface FloorplanSpecs {
  sqft?: Range;
  bed?: Range;
  bath?: Range;
  garage?: Range;
  level?: Range;
}

export interface Range {
  min: number;
  max: number;
}

export interface ISuccessResponse {
  success: true;
  text: string;
  options?: any;
}

export interface IErrorResponse {
  success: boolean;
  error: "VALIDATION_ERROR" | "MISSING_SESSION" | "INTERNAL";
  issues?: unknown;
}

export interface IFSuggestResponse {
  missing: string | null;
  suggestion: string | null;
  nextTool: string | null;
  data?: unknown;
}

export type ToolResponse = ISuccessResponse | IErrorResponse;
