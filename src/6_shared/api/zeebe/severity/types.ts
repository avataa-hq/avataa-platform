import { DataTransferFileExtension } from '6_shared/models';

export interface SeverityCount {
  filter_name: string;
  count: number;
  max_severity: number;
}

export interface GetSeverityByRangesBody {
  // ranges?: RangesNew;
  columnFilters?: ColumnFilter[];
  rangesObject?: RangesObject;
  tmoId?: number;
  findByValue?: string;
}

export interface GetSeverityProcessBody {
  tmoId: number;
  findByValue?: string;
  columnFilters?: ColumnFilter[];
  withGroups?: boolean; // default true
  rangesObject?: RangesObject;
  sort?: Sort[];
  limit?: Limit;
}

export interface GetSeverityExportProcessBody extends GetSeverityProcessBody {
  file_type: DataTransferFileExtension;
  columnIds?: string[];
  tmoIds: number[];
}

export interface GetSeverityByFiltersBody {
  filterName: string;
  columnFilters?: ColumnFilter[];
  tmoId?: number;
  severity_direction?: 'asc' | 'desc';
}

export type ColumnFilter = {
  columnName: string;
  rule: string;
  filters: ColumnFilterType[];
};

export type ColumnFilterType = {
  operator: string;
  value: string | string[];
};

type RangesObject = {
  ranges?: Record<string, ColumnFilter[]>;
  severity_direction?: 'asc' | 'desc'; // default: asc
  // rangesCleared?: RangesCleared;
};

type Sort = {
  columnName: string;
  ascending: boolean;
};

type Limit = {
  limit?: number;
  offset?: number;
};

export interface SeverityProcessModelData extends Record<string, any> {
  active: boolean;
  creation_date: string | Date;
  description: string | null;
  document_count: number;
  fuzzy_search_fields: Record<string, any>;
  id: string;
  label: string;
  latitude: number | null;
  longitude: number | null;
  model: string | null;
  modification_date: string | Date;
  name: string;
  p_id: number;
  parent_name: string | null;
  point_a_id: number | null;
  point_b_id: number | null;
  pov: Record<string, any> | null;
  processDefinitionId?: number;
  processDefinitionKey: string;
  processInstanceId: number;
  startDate: Date | null;
  state: string;
  status: string;
  tmo_id: string;
  version: number;
}

export interface SeverityProcessModel {
  rows: SeverityProcessModelData[];
  totalCount: number;
}
