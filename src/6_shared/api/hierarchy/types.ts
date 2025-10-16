import { ColumnFilter } from '6_shared';

export interface Hierarchy {
  name: string;
  description: string;
  author: string;
  created: Date;
  change_author: string;
  create_empty_nodes: boolean;
  modified: Date;
  id: number;
}

export interface HierarchyObject {
  key: string;
  object_id?: number;
  object_type_id: number;
  additional_params: string;
  aggregation_value?: number | null;
  aggregation_doc_count?: number;
  hierarchy_id: number;
  level: number;
  level_id?: string;
  external_level?: number;
  parent_level_id?: string;
  child_level_id?: string;
  parent_id: string;
  latitude: number;
  longitude: number;
  child_count: number;
  id: string;
  children_mo_ids?: number[];
  eventValues?: { [key: string]: number | string };
  label?: string | null;
}

export type HierarchyObjectWithChild = HierarchyObject & {
  child: HierarchyObject[] | HierarchyObjectWithChild[];
};

export interface HierarchyObjectWithConditionModel extends HierarchyObject {
  children_mo_ids: number[];
}

export interface NewHierarchy {
  name: string;
  create_empty_nodes: boolean;
  author: string;
  description?: string;
}

export interface HierarchyLevel {
  level: number;
  name: string;
  description: string;
  object_type_id: number;
  is_virtual: boolean;
  additional_params_id: number;
  latitude_id: number;
  longitude_id: number;
  author: string;
  created: Date;
  change_author: string;
  modified: Date;
  id: number;
  hierarchy_id: number;
  parent_id: number;
  show_without_children: boolean;
  key_attrs: string[];
  external_level?: number;
}

export type NewHierarchyLevel = {
  level: number;
  name: string;
  description?: string;
  object_type_id: number;
  is_virtual: boolean;
  additional_params_id?: number;
  latitude_id?: number;
  longitude_id?: number;
  parent_id?: number;
  author: string;
  key_attrs: string[];
};

export interface IChildNodesOfParentIdWithFilterConditionRqParam {
  hierarchy_id: number;
  parent_id: string;
  tmo_id?: number;
  filters?: ColumnFilter[];
}

export interface HierarchyPermissionsModel {
  id: number;
  itemId: number;
  rootItemId: number;
  rootPermissionId: number;
  permission: string;
  permissionName: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  admin: boolean;
}

export interface CreateMultiplePermissionsBody {
  itemId: number;
  permission: string[];
  create?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
  admin?: boolean;
}

export interface UpdatePermissionsBody {
  id: number;
  body: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    admin?: boolean;
  };
}
