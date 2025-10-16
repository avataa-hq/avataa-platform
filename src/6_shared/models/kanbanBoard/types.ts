import { InventoryObjectTypesModel, SeverityProcessModelData } from '6_shared';

export interface IKanbanStatus {
  id: string;
  name: string;
  tprmId: number;
}

export interface IKanbanTask extends SeverityProcessModelData {
  daysInColumn: number;
  tmoData?: InventoryObjectTypesModel | null;
  issueTypeId?: number | null;
  summary?: string | null;
  assignee?: string | null;
}

export interface ITaskPriotityColors {
  [objectId: string]: { color: string; name: string };
}
