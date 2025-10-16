import { IColorRangeModel } from '6_shared';

export interface SelectedColumn {
  headerName: string;
  field: string;
  type: string;
}

export interface IProcessManagerData {
  pmTmoId?: number;
  multiSearchValue: string;
  selectedGroup: string | null;

  // isOpenLeftPanel: boolean;

  selectedColumnForColoring?: SelectedColumn;
  // isOpenSelectingColorModal?: boolean;
  // isOpenSettingColorModal?: boolean;
  tprmColIds: string[];
  colorRangesData: IColorRangeModel[];
  groupedColorRangesData: Record<string, IColorRangeModel[]> | null;
  // isLinkedObjectsModalOpen: boolean;
  // isRelatedObjectsModalOpen: boolean;
  isOpenMapActive: boolean;
  isOpenDashboardActive: boolean;

  viewType: ProcessManagerPageMode;
}

const processContextMenuActionTypes = {
  claim: 'claim',
  assignTo: 'assignTo',
  copy: 'copy',
  group: 'group',
  createDynamicGroup: 'createDynamicGroup',
  openMap: 'openMap',
  openDashboard: 'openDashboard',
  showRule: 'showRule',
  closeAlarm: 'closeAlarm',
  showLinkedObjects: 'showLinkedObjects',
  showHistory: 'showHistory',
  showRelatedObjects: 'showRelatedObjects',
  openTaskManager: 'openTaskManager',
  delete: 'Delete',
  completeTask: 'completeTask',
  unclaim: 'unclaim',
} as const;

export type ProcessContextMenuActionType = keyof typeof processContextMenuActionTypes;

export type SeverityType = { from?: number; to?: number; color: string; isEmpty?: boolean };

export type SelectedSeverity = {
  [key: string]: SeverityType;
}[];

export type ProcessManagerPageMode = 'list' | 'grid' | 'tasks';

export interface IProcessManagerContextMenuConfig {
  type: 'item' | 'submenu';
  label: string;
  action: ProcessContextMenuActionType;
  disabled?: boolean;
  children?: string[];
}
