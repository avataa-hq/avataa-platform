import { LineType } from '../types';

export interface IGetObjectTypeRqParams {
  object_types_ids?: number[];
  with_tprms?: boolean; // default false
}

export interface InventoryObjectTypesParamTypes {
  val_type: string;
  group: string;
  multiple: boolean;
  id: number;
  required: boolean;
  version: number;
  searchable: boolean;
  created_by: string;
  returnable: boolean;
  modified_by: string;
  name: string;
  automation: boolean;
  creation_date: Date;
  tmo_id: number;
  constraint: string;
  modification_date: Date;
  description: string | null;
  prm_link_filter: any;
}

export interface InventoryObjectTypesModel {
  id: number;
  version: number;
  name: string;
  p_id: number | null;
  latitude: number | null;
  longitude: number | null;
  status: number | null;
  icon: string | null;
  description: string | null;
  child_count?: number;
  virtual: boolean;
  global_uniqueness: boolean;
  primary: number[];
  created_by: string;
  modified_by: string;
  creation_date: Date;
  modification_date: Date;
  lifecycle_process_definition: string | null;
  geometry_type: ObjectTypeGeometryType | null;
  severity_id?: number | null;
  materialize?: boolean;
  minimize: boolean;
  inherit_location?: boolean;
  tprms?: InventoryObjectTypesParamTypes[];
  line_type: LineType | null;
  points_constraint_by_tmo: number[] | null;
}

// 0. Neither lat/long nor geometry_type is defined. In this case the MO lat/long and geometry are null.
// 1. In TMO the lat/long is defined, geometry_type is not defined. In this case the MO lat/long is defined, geometry is null.
// 2. In TMO geometry_type === 'point', lat/long === null. In MO lat/long and geometry is null ??
// 3. In TMO geometry_type === 'line', lat/long === null. In MO lat/long and geometry is null ??
// 4. In TMO geometry_type === 'line, lat/long === null. In MO lat/long === null, geometry is `{path: "[lat, long][]" (as string), path_length: number}`
// 5. In TMO geometry_type === 'point', lat/long are defined. In MO lat/long are defined, geometry is null.

export interface CreateObjectTypeBody {
  name: string;
  p_id: number | null;
  icon: string | null;
  description: string | null;
  virtual: boolean;
  global_uniqueness: boolean;
  lifecycle_process_definition: string | null;
  geometry_type: null | ObjectTypeGeometryType;
  materialize: boolean;
  points_constraint_by_tmo?: number[];
  inherit_location: boolean;
  minimize: boolean;
  line_type: LineType | null;
}

export interface DeleteObjectTypeRequestParams {
  id: number;
  delete_childs?: boolean; // default = false
}
export type ObjectTypeGeometryType = 'point' | 'line' | 'polygon';
export interface UpdateObjectTypeParams {
  version: number;
  name?: string;
  id: number;
  p_id?: number;
  latitude?: number;
  longitude?: number;
  status?: number;
  icon?: string;
  description?: string;
  virtual?: boolean;
  global_uniqueness?: boolean;
  primary?: number[];
  lifecycle_process_definition?: string;
  severity_id?: number;
  geometry_type?: ObjectTypeGeometryType;
  materialize?: boolean;
  points_constraint_by_tmo?: number[];
  inherit_location: boolean;
  line_type?: LineType | null;
}

export interface GetObjectTypeHistoryRequestParams {
  id: number;
  date_from?: Date;
  date_to?: Date;
}

export interface GetChildrenTmoDataByTmoIdRequestParams {
  tmoId: number;
  with_params?: boolean;
}
