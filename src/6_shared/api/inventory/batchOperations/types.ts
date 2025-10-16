export interface GetObjectRequestParams {
  tmo_id: number;
  file_type: 'csv' | 'xlsx';
  obj_ids: number[] | null;
  prm_type_ids?: string[];
  filters?: string;
  delimiter?: string;
}

export interface BatchObjectsWithParametersResponse {
  will_be_updated_mo: number;
  will_be_created_mo: number;
  will_be_updated_parameter_values: number;
  will_be_created_parameter_values: number;
  will_be_deleted_parameter_values: number;
}
