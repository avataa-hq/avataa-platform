export type InventoryValType =
  | 'str'
  | 'int'
  | 'float'
  | 'bool'
  | 'date'
  | 'datetime'
  | 'mo_link'
  | 'prm_link'
  | 'formula'
  | 'sequence'
  | 'user_link'
  | 'two-way link'
  | 'enum';

export const lineTypes = {
  twodash: 'twodash',
  solid: 'solid',
  longdash: 'longdash',
  dotted: 'dotted',
  dotdash: 'dotdash',
  dashed: 'dashed',
  blank: 'blank',
} as const;

export type LineType = keyof typeof lineTypes;

export interface InventoryObjectType {
  id: number;
  version: number;
  name: string;
  p_id: null | number;
  latitude: null | number;
  longitude: null | number;
  status: null | number;
  icon: null | string;
  description: null | string;
  child_count: number;
  virtual: boolean;
  global_uniqueness: boolean;
  primary: number[];
  label: number[];
  created_by: string;
  modified_by: string;
  creation_date: Date;
  modification_date: Date;
  lifecycle_process_definition: string | null;
  geometry_type: null | 'point' | 'line' | 'polygon';
  severity_id: null | number;
  materialize: boolean;
  inherit_location: boolean;
  minimize: boolean;
  line_type: LineType | null;
  points_constraint_by_tmo: number[] | null;
}

export interface InventoryParameterType {
  description: null | string;
  multiple: boolean;
  required: boolean;
  searchable: boolean;
  returnable: boolean;
  automation: boolean;
  primary: boolean;
  constraint: null | string;
  prm_link_filter: null | string;
  group: null | string;
  id: number;
  version: number;
  creation_date: Date;
  modification_date: Date;
  name: string;
  val_type:
    | 'str'
    | 'int'
    | 'float'
    | 'bool'
    | 'date'
    | 'datetime'
    | 'mo_link'
    | 'prm_link'
    | 'formula'
    | 'sequence'
    | 'two-way link'
    | 'enum';
  tmo_id: number;
  created_by: string;
  modified_by: string;
}
