export interface IProcessDefinition {
  key: number;
  name?: string;
  version: number;
  bpmnProcessId: string;
  timestamp: string;
}

export interface IGetProcessDefinitionModel {
  items: IProcessDefinition[];
  total: number;
}

export interface IGetProcessDefinitionBody<T extends Record<string, any> = Record<string, any>> {
  filter_columns?: { columnName: keyof T; value: string };
  sort?: { field: keyof T; order: 'ASC' | 'DESC' };
  offset?: number;
  limit?: number;
}

export interface IGetFlownodeInstanceBody extends Omit<IGetProcessDefinitionBody, 'limit'> {}

interface IFlowNodeInstance {
  flowNodeId: string;
  key: number;
  processInstanceKey: number;
  processDefinitionKey: number;
  startDate?: Date;
  endDate?: Date | null;
  flowNodeName?: string;
  type?: string;
  state?: 'COMPLETED' | 'ACTIVE';
  // incident?: boolean;
}
export interface IFlowNodeInstanceSearchResponse {
  items: IFlowNodeInstance[];
  sortValues: number[];
  total: number;
}
