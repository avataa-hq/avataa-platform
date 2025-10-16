import { IParams } from '5_entites/rightSidePanel';
import {
  IGetTemplatesByFilterModel,
  InventoryObjectTypesModel,
  IObjectTemplateModel,
} from '6_shared';
import { type Node } from '@xyflow/react';

export interface ICustomTemplateGraphNode extends Node {
  data: {
    label: string;
    object_type_id: number;
    isValid: boolean;
    isParent: boolean;
    [key: string]: any;
  };
}

export interface ITemplateGraphContextMenuPosition {
  node: ICustomTemplateGraphNode;
  top: number;
  left: number;
}

export interface ICreateChildTemplateIds {
  object_type_id: number;
  template_id: number;
  parent_id?: number;
}

export type TemplateMode = 'create' | 'edit' | 'createChild';

export interface ITemplateParam extends IParams {
  templateParamId?: number;
}

type TemplateGraphContextMenuItem = 'addChild' | 'edit' | 'delete';

export interface ITemplateGraphContextMenuItem {
  menuType: TemplateGraphContextMenuItem;
  objType?: InventoryObjectTypesModel;
  templateObjectId?: number | null;
}

export interface ISecondaryActionSlotProps {
  item: IGetTemplatesByFilterModel;
  selectedTemplateId?: number | null;
  editedTemplateName?: string;
  isEditTemplateName?: boolean;
  setEditedTemplateName?: (name: string) => void;
  buildTemplatesFormDataLoading?: boolean;
  onEditTemplateClick?: (template: IObjectTemplateModel) => void;
  onApplyEditTemplateName?: (newTemplateName: string) => void;
  onCloseEditTemplateName?: () => void;
  onDeleteTemplateClick?: (template: IObjectTemplateModel) => void;
}

export interface ITemplateParamsFromData {
  objectTypeId: number;
  params: Record<string, any>;
  hasEmptyRequiredParams: boolean;
}
