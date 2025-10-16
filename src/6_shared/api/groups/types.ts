import type { ColumnFilter } from '../zeebe';
import { IInventoryFilterModel } from '../../types';
// GROUP ELEMENTS

export type IAddElementsToGroupBody = { entity_id: number };
export interface IElementsMutationRequestParams {
  group_name: string;
  body: IAddElementsToGroupBody[];
}

export interface IProcessElementGroupModel {
  entity_id: number;
  group_id: number;
  id: number;
}

// GROUPS
export interface IProcessGroupModel {
  group_name: string;
  group_type_id: number;
  group_process_instance_key: number | null;
  tmo_id: number;
  // is_valid: null;
  // column_filters: null;
  is_aggregate: boolean;
  id: number;
}

type ProcessGroupType = 'process_group' | 'object_group';

export interface ICreateGroupBody {
  group_info: {
    group_name: string;
    group_type: ProcessGroupType;
    tmo_id: number;
    columnFilters: ColumnFilter[];
    is_aggregate?: boolean; // default false
    min_qnt?: number;
  };
}

interface IDeleteGroupRequestParams {
  group_id?: number;
  group_name?: string[];
}

export interface IGetGroupStatisticRequestParams extends IDeleteGroupRequestParams {}

export interface IGroupStatisticModel {
  group_name: string;
  group_type_id: number;
  statistic: Record<string, any>;
}

export interface IGetGroupsByTypeRequestParams {
  group_type: string;
  limit?: number;
  offset?: number;
}

export interface IGetGroupByTypeModel {
  groups: IProcessGroupModel[];
  total: number;
}

// GROUP TEMPLATES

export interface IGroupTemplateModel {
  name: string;
  column_filters: IInventoryFilterModel[];
  ranges_object?: Record<string, IInventoryFilterModel[]>;
  identical: number[] | null; // tprms ids
  min_qnt: number;
  tmo_id: number;
  id: number;
}

export interface IGroupTemplatesBody {
  group_template_info: Omit<IGroupTemplateModel, 'id'> & {
    group_type_name: ProcessGroupType;
  };
}
