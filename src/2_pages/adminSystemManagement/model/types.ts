import { ModuleSettingsType, SearchHierarchyModel } from '6_shared';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export type EditDashboardKpiData = {
  module: string;
  hierarchyId: string;
  subgroup: string;
  tmoName?: string;
  groupId: string;
  kpiConsecutiveValue: string;
  key?: string;
  newValue?: string;
  emptyKpi?: Record<string, unknown>;
  action?: 'add' | 'modify' | 'delete';
};

export type AddExternalLevel = {
  module: string;
  hierarchyId: string;
  name: string;
  tmoId: string;
  levelId: string;
  externalLevel: number;
};

export type EditModuleDataType = {
  defaultModuleName: string;
  groupName: string;
  key: string;
  newValue?:
    | string
    | number
    | boolean
    | Record<string, unknown>
    | (Record<string, unknown> | string)[];
  nestedKey?: string;
  newNestedValue?: string;
};

interface IBaseModuleSettingsListItemProps {
  defaultModuleName: string;
  form: UseFormReturn<FieldValues, any, undefined>;
  editRow: ModuleSettingsType[] | null;
  setEditRow: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  objects: Record<string, any>;
}

export interface ModuleSettingsListItemProps extends IBaseModuleSettingsListItemProps {
  groupName: string;
  value: any;
  editModuleData: (data: EditModuleDataType) => void;
  editDashboardKpiData: (data: EditDashboardKpiData) => void;
  addExternalLevel: (data: AddExternalLevel) => void;
  openItemModal: { id: string; type: string } | null;
  setOpenItemModal: (item: { id: string; type: string } | null) => void;
  hierarchies: SearchHierarchyModel | undefined;
  setModuleData: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  moduleData: ModuleSettingsType[] | null;
}

export interface IRegulatorItemProps extends IBaseModuleSettingsListItemProps {
  groupName: string;
  value: any;
  editModuleData: (data: EditModuleDataType) => void;
}

export interface IRenderHierarchyModalsProps extends IBaseModuleSettingsListItemProps {
  openItemModal: { id: string; type: string } | null;
  editDashboardKpiData: (data: EditDashboardKpiData) => void;
  addExternalLevel: (data: AddExternalLevel) => void;
  setModuleData: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  moduleData: ModuleSettingsType[] | null;
  hierarchies: SearchHierarchyModel | undefined;
  setOpenItemModal: (item: { id: string; type: string } | null) => void;
}
