import { GridLogicOperator } from '@mui/x-data-grid';
import { DataTransferFileExtension } from '6_shared/models';
import type { IInventoryBoundsModel } from '6_shared';
import { ColumnFilter } from '../zeebe';
import { Hierarchy, HierarchyObject } from '../hierarchy/types';
import { IInventoryFilterModel, IInventoryObjectModel } from '../../types';

export interface IGetObjectsByCoordsBody extends IInventoryBoundsModel {
  tmo_ids?: number[];
  limit?: number; // default ONE MILLION
  offset?: number;
  only_active?: boolean; // default true
  with_parameters?: boolean; // default false

  signal?: AbortSignal;
}

export interface IInventorySearchObjectModel {
  name: string;
  id: number;
  tmo_id: number;
  active: boolean;
  p_id: number;
  version: number;
  latitude: number | null;
  longitude: number | null;
  point_a_id: number | null;
  point_b_id: number | null;
  status: string | null;
  model: any | null;
  creation_date: string | Date | null;
  modification_date: string | Date | null;
  geometry: IInventorySearchGeometryModel | null;
  pov: any | null;
  parameters: Record<string, any>;
  tmo_name: string;
}

interface IInventorySearchGeometryModel {
  path: {
    type: string;
    coordinates: number[][];
    path_length: number;
  };
}

export interface SearchForObjectsInSpecificTmoParams {
  search_value: string;
  tmo_id: number;
  limit?: number;
  offset?: number;
}

export interface SearchObjectModel {
  tmo_id: number;
  active: boolean;
  p_id: number | null;
  latitude: number;
  point_a_id: number | null;
  longitude: number;
  point_b_id: number | null;
  status: string | null;
  model: string | null;
  document_count: number;
  id: number;
  creation_date: string | null;
  geometry: string | null;
  version: number;
  modification_date: string | null;
  pov: any;
  name: string;
  parameters: Record<string, any>;
}

export interface IGetInventoryObjectsByValueRequestBody {
  search_value: string;
  tmo_ids?: number[];
  with_groups?: boolean;
  limit?: number;
  offset?: number;
  include_tmo_name?: boolean; // default false;
  signal?: AbortSignal;
}

export interface IGetInventoryObjectsByValueModel {
  objects: IInventorySearchObjectModel[];
  total_hits: number;
}

export interface IFilterColumn {
  columnName: string;
  rule: GridLogicOperator | undefined;
  filters: {
    operator: string;
    value: any;
  }[];
}

export interface ISortColumn {
  columnName: string;
  ascending: boolean;
}

export interface IGetObjectsByFiltersBody {
  filter_columns: IFilterColumn[];
  tmo_id: number;
  sort_by?: ISortColumn[];
  search_by_value?: string | null;
  with_groups?: boolean;
  limit?: number;
  offset?: number;
}

export interface ObjectByFilters extends IInventoryObjectModel {
  point_a_name: string;
  point_b_name: string;
}

export interface IGetObjectsByFiltersModel {
  objects: ObjectByFilters[];
  total_hits: number;
}

export interface MoLinkInfoModel {
  tmo_name: string;
  tmo_id: number;
  tprm_name: string;
  tprm_id: number;
  mo_name: string;
  mo_id: number;
  parent_mo_name: string | null;
  parent_mo_id: number | null;
  multiple: boolean;
  value: number[];
}

export interface MoLinkInfoParams {
  id: number;
  limit?: number;
  offset?: number;
}

type ValType =
  | 'str'
  | 'date'
  | 'datetime'
  | 'float'
  | 'int'
  | 'bool'
  | 'mo_link'
  | 'prm_link'
  | 'user_link'
  | 'formula'
  | 'sequence'
  | 'enum';

export type OperatorType =
  | 'contains'
  | 'notContains'
  | 'equals'
  | 'notEquals'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'isAnyOf'
  | 'isNotAnyOf'
  | 'more'
  | 'moreOrEq'
  | 'less'
  | 'lessOrEq'
  | 'inPeriod';

type KeyType = {
  [key in ValType]: Partial<OperatorType>;
};

export interface GetOperatorType {
  [key: string]: KeyType[keyof KeyType];
}

export interface IGetAvailableSearchOperatorsForSpecialMoAttrOrTprmBody {
  mo_attr_or_tprm_id: string;
}

export interface IGetAvailableSearchOperatorsForSpecialMoAttrOrTprmModel {
  val_type: ValType;
  operators: OperatorType[];
}

interface LinkInfoTmosModel {
  tmo_id: number;
  tprm_id: number[];
  tmo_name: string;
}

export interface MoLinkInfoResponse {
  mo_link_info: MoLinkInfoModel[];
  total: number;
  additional_info: LinkInfoTmosModel[];
}

interface IRangesObject {
  ranges?: Record<string, ColumnFilter[]>;
  severity_direction?: 'asc' | 'desc';
}

export interface GetExportedObjectsBody {
  tmo_id: number;
  find_by_value?: string | null;
  filters_list?: IFilterColumn[];
  with_groups?: boolean;
  sort?: ISortColumn[];
  columns?: string[];
  file_type: DataTransferFileExtension;
  csv_delimiter?: string;
  with_parents_data?: boolean;
}

export interface GetExportedProcessesBody extends GetExportedObjectsBody {
  ranges_object?: IRangesObject;
}

export type SearchHierarchyModelItem = Hierarchy & { status: string };
export interface SearchHierarchyModel extends Hierarchy {
  count: number;
  items: SearchHierarchyModelItem[];
}

export interface SearchHierarchyBody {
  with_lifecycle?: boolean; // default false
  sort_by_field?: string; // default "id"
  sort_direction?: 'asc' | 'desc'; // default "asc"
  limit?: number;
  offset?: number;
}

// ============= Hierarchy And Inventory Result ========================

export interface IHierarchyAndInventoryResultModel {
  hierarchy_results: {
    total_hits: number;
    objects: HierarchyObject[];
  };
  inventory_results: {
    total_hits: number;
    objects: IInventoryObjectModel[];
  };
  aggregation_by_ranges: {
    [key: string]: { doc_count: number };
  } | null;
}

export interface IHierarchyAndInventoryResultBody {
  hierarchy_id: number;
  filters?: IHierarchyAndInventoryResultFilters[];
  parent_node_id?: string;
  aggregation?: IHierarchyAndInventoryResultAggregation;
  inventory_res?: IHierarchyAndInventoryResultInventoryBodyModel;
}

export interface IHierarchyAndInventoryResultFilters {
  filter_columns?: IInventoryFilterModel[];
  search_by_value?: string;
  tmo_id: number;
}
interface IHierarchyAndInventoryResultAggregation {
  tprm_id: number;
  tmo_id: number;
  aggregation_type: 'avg' | 'min' | 'max';
}

export interface IHierarchyAndInventoryResultInventoryBodyModel {
  return_results?: boolean;
  sort_by?: ISortColumn[];
  with_groups?: boolean;
  limit?: number;
  offset?: number;
  should_filter_conditions?: IInventoryFilterModel[][];
  aggregation_by_ranges?: {
    aggr_items: IHierarchyAndInventoryResultInventoryBodyRangesItemModel[];
    aggr_by_tprm_id?: number;
    aggregation_type?: 'avg' | 'min' | 'max';
  };
}
export interface IHierarchyAndInventoryResultInventoryBodyRangesItemModel {
  aggr_name: string;
  aggr_filters: IInventoryFilterModel[];
}

// ============= Child Nodes Of Parent Id With Filter Condition ========================

export interface IChildNodesOfParentIdWithFilterConditionModel {
  count: number;
  items: IChildNodesOfParentIdWithFilterConditionHierarchyItemModel[];
}
interface IChildNodesOfParentIdWithFilterConditionHierarchyItemModel {
  active: boolean;
  additional_params: any | null;
  child_count: number;
  hierarchy_id: number;
  id: string;
  key: string;
  key_is_empty: boolean;
  level: number;
  level_id: number;
  object_type_id: number;
  latitude: number | null;
  longitude: number | null;
  object_id: number | null;
  parent_id: number | null;
  path: string | null;
}
export interface IChildNodesOfParentIdWithFilterConditionBody {
  hierarchy_id: number;
  parent_id: string;
  hierarchy_filter?: string;
  aggregation_type?: string;
  nodes_sort_by?: ISortColumn[];
  limit?: number;
  offset?: number;
  search_children_node_by_key?: string;
  aggregation_tprm?: number;
}

export interface IGetObjectsByNameWithMisspelledWordsOrTypoMistakesBody {
  tmo_id: number;
  limit: number;
  offset: number;
  search_value: string;
}

interface IGetObjectsByNameWithMisspelledWordsOrTypoMistakesMetadata {
  step_count: number;
  limit: number;
  offset: number;
  total_hits: number;
}

export interface IGetObjectsByNameWithMisspelledWordsOrTypoMistakesModel {
  metadata: IGetObjectsByNameWithMisspelledWordsOrTypoMistakesMetadata;
  objects: IInventorySearchObjectModel[];
}

export interface IPointsEvenlyPointModel {
  id: number;
  latitude: number;
  longitude: number;
}
export interface IPointsEvenlyLineModel {
  id: number;
  point_a: number;
  point_b: number;
}
export interface IPointsEvenlyBody {
  start_points: IPointsEvenlyPointModel[];
  end_points: IPointsEvenlyPointModel[];
  list_of_lines: IPointsEvenlyLineModel[];
  list_of_points: IPointsEvenlyPointModel[];
}
export interface IPointsEvenlyModel {
  end_point: IPointsEvenlyPointModel;
  start_point: IPointsEvenlyPointModel;
  way_of_vertexes: IPointsEvenlyPointModel[];
  way_of_edges: IPointsEvenlyLineModel[];
}

export interface OutMoLinkData {
  tprm_id: number;
  tprm_name: string;
  multiple: boolean;
  mo_out_info: {
    id: number;
    name: string;
    p_id: string | number;
    parent_name: string | null;
    tmo_id: number;
  };
}

interface OutMoLink {
  mo_id: number;
  mo_out_data: OutMoLinkData[];
}

export interface OutMoLinkModel {
  out_mo_link_info: OutMoLink[];
}

export interface IncMoLinkModelForObjectsList {
  list_info: {
    mo_link_info_response: MoLinkInfoResponse;
    mo_id: number;
  }[];
}
