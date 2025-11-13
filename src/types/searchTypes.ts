export interface IFArgsSearch {
  facetType: string;
  query: string;
  filters: string[] | string;
  numericFilters?: string[];
  searchParams?: {
    aroundLatLng: string;
    aroundRadius: number;
  };
  indexName?: string;
}

export type QueryFilter = QueryFilterNumeric | QueryFilterText;

type NumericFilterType = "specs.level" | "specs.sqft" | "specs.bed" | "width";

type TextFilterType =
  | "objectType"
  | "specs.divisionState"
  | "floorplan.status"
  | "_origin.division.state";

export type QueryFilterNumeric = {
  type: "numeric";
  key: NumericFilterType;
  label: string;
  min?: number;
  max?: number;
};

export type QueryFilterText = {
  type: "text";
  key: TextFilterType;
  label: string;
  value: string[];
};