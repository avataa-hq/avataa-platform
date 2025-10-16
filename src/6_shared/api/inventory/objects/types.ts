import { GridSortModel } from '@mui/x-data-grid-premium';
import { IGetObjectsByFiltersBody } from '6_shared/api/searchV2';
import { InventoryParameterTypesModel } from '../parameterTypes/types';
import { IInventoryGeometryModel, IInventoryObjectModel } from '../../../types';

// This type is defined in case we need to work with legacy geometry

export interface InventoryObjectWithGroupedParametersParamsModel
  extends InventoryParameterTypesModel {
  tprm_id: number;
  mo_id: number;
  version: number;
  value: any | null;
  prm_id: number | null;
}

export interface InventoryObjectWithGroupedParametersModel {
  name: string;
  params: InventoryObjectWithGroupedParametersParamsModel[];
}

export interface GetObjectWithParametersQueryParamsRequest {
  id: number | null;
  with_parameters?: boolean; // default false
}

export interface DeleteMultipleObjectsBody {
  mo_ids: number[];
  erase?: boolean; // default = false;
  delete_children?: boolean; // default = false;
}

interface IMultipleObjectUpdateData {
  version: number;
  p_id?: number | null;
  point_a_id?: number | null;
  point_b_id?: number | null;
  pov?: any;
  geometry?: IInventoryGeometryModel | null;
  model?: string;
  active?: boolean;
  description?: string | null;
}

export interface UpdateMultipleObjectsBody {
  object_id: number;
  data_for_update: IMultipleObjectUpdateData;
}

export interface GetObjectRequestParams {
  object_type_id?: number;
  obj_id?: number[];
  order_by_tprms_id?: GridSortModel;
  filters?: string;
  p_id?: number;
  with_parameters?: boolean; // default false
  active?: boolean;
  limit?: number;
  offset?: number;
  name?: string;
}

export interface CreateObjectBody {
  tmo_id: number;
  params: { value: string; tprm_id: number }[];
  p_id?: number;
  point_a_id?: number;
  point_b_id?: number;
  pov?: any;
  geometry?: IInventoryGeometryModel | null;
  model?: string;
  description?: string | null;
}

export interface InventoryObjectWithGroupedParametersRequestParams {
  id: number | null;
  only_filled?: boolean; // default = false
}

export interface IGetObjectsByObjectTypesRequestParams {
  object_type_ids: number[];
  show_objects_of_children_object_types?: boolean; // default = false;
  with_parameters?: boolean; // default = false;
  active?: boolean; // default = true;
  limit?: number; // default = 50;
  offset?: number; // default = 0;

  outer_box_longitude_min?: number;
  outer_box_longitude_max?: number;
  outer_box_latitude_max?: number;
  outer_box_latitude_min?: number;

  inner_box_longitude_min?: number;
  inner_box_longitude_max?: number;
  inner_box_latitude_max?: number;
  inner_box_latitude_min?: number;
}

interface ObjectsByObjectTypesTypeIdsModel {
  id: number;
  icon: string | null;
}

export interface ObjectsByObjectTypesModel {
  object_types: ObjectsByObjectTypesTypeIdsModel[];
  objects: IInventoryObjectModel[];
}

export interface GetObjectsByObjectNamesRequestParams {
  tmo_id: number | null;
  objects_names: string[];
  limit?: number; // default = 50;
  offset?: number; // default = 0;
}

export interface ObjectByObjectNamesModel {
  data: IInventoryObjectModel[];
  total: number;
}

export interface ObjectsByTprmIdModel {
  prm_id: number;
  mo_id: number;
  mo_name: string;
  prm_value: string[] | number[];
}

export interface GetObjectsByTprmIdRequestParams {
  tprm_id: number | null;
  limit?: number; // default = 50;
  offset?: number; // default = 0;
}

export interface GetObjectsByTprmIdAndPrmValueRequestParams
  extends GetObjectsByTprmIdRequestParams {
  value?: string;
}

export interface ObjectByTprmIdAndPrmValue {
  prm_id: number;
  mo_id: number;
  mo_name: string;
  prm_value: string;
}

export interface ObjectsByTprmIdAndPrmValueModel {
  data: ObjectByTprmIdAndPrmValue[];
  total: number;
}

export interface GetObjectsByPostMethodBody {
  object_type_id?: number;
  p_id?: number;
  name?: string;
  obj_id: number[] | null;
  with_parameters?: boolean;
  active?: boolean;
  limit?: number;
  offset?: number;
  order_by_tprms_id?: string[];
  order_by_asc?: boolean[];
  identifiers_instead_of_values?: boolean;
  filter_params?: string;
}

export interface InheritLocationParentObjectModel {
  parent_mo: IInventoryObjectModel;
  tprm_latitude: number;
  tprm_longitude: number;
}

export interface AllChildrenResponse {
  object_id: number;
  parent_id: number | null;
  object_name: string;
  object_type_id: number;
  children: AllChildrenResponse[];
}

export interface IGetObjectChildWithProcessInstanceIdModel {
  object_id: number;
  processInstanceId: string;
  pprocessDefinitionId: string;
}
