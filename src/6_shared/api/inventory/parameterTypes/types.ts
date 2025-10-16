import { InventoryValType } from '../types';

export interface InventoryParameterTypesModel {
  name: string;
  description: string | null;
  val_type: InventoryValType;
  multiple: boolean;
  required: boolean;
  searchable: boolean;
  returnable: boolean;
  automation: boolean;
  constraint: string | null;
  prm_link_filter: string | null;
  group: string | null;
  tmo_id: number;
  id: number;
  version: number;
  created_by: string;
  modified_by: string;
  creation_date: Date;
  modification_date: Date;
  primary: boolean;
  field_value?: string | null;
}
export interface InventoryRequiredParameterTypesModel extends InventoryParameterTypesModel {
  primary: boolean;
}
export interface CreateParamTypeBody {
  name: string;
  val_type: InventoryValType;
  tmo_id?: number;
  description?: string;
  multiple?: boolean;
  required?: boolean;
  searchable?: boolean;
  returnable?: boolean;
  automation?: boolean;
  constraint?: string | number | null;
  prm_link_filter?: string;
  group?: string | null;
  field_value?: string | string[] | number[] | boolean[];
}
export interface UpdateParamTypeBody {
  id: number;
  version: number;
  name?: string;
  description?: string;
  required?: boolean;
  field_value?: string;
  searchable?: boolean;
  returnable?: boolean;
  automation?: boolean;
  constraint?: string;
  group?: string;
  force?: boolean;
}

export interface GetObjectTypeParamTypesRequestParams {
  id: number;
  group?: string;
  tprm_ids?: string[];
}

export interface CreateObjectTypeParamTypesBody {
  id: number;
  body: {
    name: string;
    val_type: InventoryValType;
    description?: string;
    multiple?: boolean;
    required?: boolean;
    searchable?: boolean;
    returnable?: boolean;
    automation?: boolean;
    group?: string;
    constraint?: string;
    prm_link_filter?: string;
    field_value?: string;
  }[];
}

export interface UpdateValTypeBody {
  id: number;
  version: number;
  val_type: InventoryValType;
  force?: boolean;
  field_value?: string | string[] | number[] | boolean[] | null;
}

export interface GetParamTypeHistoryRequestParam {
  id: number;
  date_from?: Date;
  date_to?: Date;
}

export interface UpdateBatchOfParamTypesBodyItem {
  name: string;
  description?: string;
  val_type: string;
  multiple?: boolean;
  required?: boolean;
  searchable?: boolean;
  returnable?: boolean;
  automation?: boolean;
  group?: string;
  constraint?: string;
  prm_link_filter?: string;
  field_value?: string;
}

export interface UpdateBatchOfParamTypesBody {
  id: number;
  body: UpdateBatchOfParamTypesBodyItem[];
}

export interface UpdateBatchOfParamTypesCheckResponse {
  will_be_updated: number;
  will_be_created: number;
}
