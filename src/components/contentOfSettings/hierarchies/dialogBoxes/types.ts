import { IAttributesList } from '../utilities/interface';

export interface AddHierarchyFormInputs {
  name: string;
  create_empty_nodes: boolean;
  author: string;
  description?: string;
}
export interface AddHierarchyLevelFormInputs {
  name: string;
  level: number;
  object_type_id: number;
  is_virtual: boolean;
  author: string;
  description?: string;
  latitude_id?: number;
  longitude_id?: number;
  additional_params_id?: number;
  parent_id?: number;
  show_without_children: boolean;
  key_attrs: string[];
}
export interface EditHierarchyFormInputs {
  name: string;
  create_empty_nodes: boolean;
  author: string;
  description?: string;
}

export interface EditHierarchyLevelFormInputs {
  name: string;
  level: number;
  object_type_id: number | '';
  is_virtual: boolean;
  author: string;
  description?: string;
  latitude_id?: number;
  longitude_id?: number;
  additional_params_id?: number;
  show_without_children: boolean;
  key_attrs?: IAttributesList[];
}
