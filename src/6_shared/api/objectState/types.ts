export interface GetAggregatedValues {
  kpi_id: number;
  object_ids: number[];
  granularity_id: number;
  aggregation_type: string;
  date_from: string;
  date_to: string;
}

export interface KpiValues {
  [key: string]: number;
}

export interface KpiValueResponse {
  id: number;
  object_id: number;
  granularity_id: number;
  value: number;
  record_time: string;
  state: string;
}

export interface kpiResponse {
  id: number;
  name: string;
  description?: string;
  label: string;
  val_type: string;
  multiple: boolean;
  object_type: number;
  group: null | string;
  branch?: string | null;
}

export interface GranularityResponse {
  id: number;
  kpi_id: number;
  name: string;
  seconds: number;
}
