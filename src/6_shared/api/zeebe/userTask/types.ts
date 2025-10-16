type TaskState = 'CREATED' | 'COMPLETED' | 'CANCELED';
type TaskIntentType =
  | 'CREATING'
  | 'CREATED'
  | 'COMPLETING'
  | 'COMPLETED'
  | 'ASSIGNING'
  | 'ASSIGNED'
  | 'CANCELING'
  | 'CANCELED';

interface IUserTaskVariable {
  name: string;
  value: any;
}

export interface IGetUserTaskBody {
  bpmnProcessId: string;
  state?: TaskState[];
  with_variables?: boolean; // Default false;
  processDefinitionId?: number;
  processInstanceId?: number[];
  limit?: number;
  offset?: number;
  sort?: { columnName: string; ascending: 'asc' | 'desc' }[];
  next_cursor?: any[];
}

export interface ICamundaUserTaskModel {
  id: string;
  name: string;
  bpmnProcessId: string;
  creationTime?: Date | null;
  completionTime?: Date | null;
  assignee: string | null;
  taskState: TaskState;
  form_key: string | null;
  form_id: string | null;
  formVersion: string | null;
  isFormEmbedded: boolean;
  processDefinitionId: string;
  processInstanceId: string;
  tenant_id: string | null;
  dueDate: string | null;
  followUpDate: string | null;
  candidateGroups: string[] | null;
  candidateUsers?: string[] | null;
  implementation?: string | null;
  flowNodeInstanceId?: string | null;
  variables?: IUserTaskVariable[];
}

export interface IGetUserTaskResponse {
  data: ICamundaUserTaskModel[];
  total: number;
}

export interface ICompleteUserTaskBody {
  user_task_key: number;
  variables?: Record<string, any>;
  action?: string;
}
export interface IClaimUserTaskBody {
  user_task_key: number;
  assignee: string;
  action?: string;
}

export interface IGetIncidentsBody
  extends Omit<
    IGetUserTaskBody,
    'with_variables' | 'state' | 'processDefinitionId' | 'processInstanceId'
  > {
  processDefinitionKey?: number;
  processInstanceKey?: number[];
}

interface IIncidentValueModel {
  elementId: string;
  processDefinitionKey: number;
  jobKey: number;
  errorType: string;
  variableScopeKey: number;
  errorMessage: string;
  processInstanceKey: number;
  elementInstanceKey: number;
  tenantId?: string | null;
  bpmnProcessId: string;
}

interface IIncidentModel {
  intent: string;
  recordType: string;
  key: number;
  value: IIncidentValueModel;
}

export interface IGetIncidentsResponse {
  total: number;
  next_cursor: number[];
  data: IIncidentModel[];
}

export interface IGetActiveElementsBody {
  bpmnProcessId: string;
  processDefinitionKey?: number;
  processInstanceKey?: number[];
  limit?: number;
  offset?: number;
  sort?: { columnName: string; ascending: 'asc' | 'desc' }[];
  next_cursor?: any[];
}

interface IActiveElementModel {
  element_id: string;
  process_definition_key: number;
  bpmn_element_type: string;
  flow_scope_key: number;
  bpmn_event_type: string;
  parent_process_instance_key: number;
  parent_element_instance_key: number;
  version: number;
  process_instance_key: number;
  bpmn_process_id: string;
  intent: string;
  rejection_type: string;
  rejection_reason: string;
  tenant_id?: string | null;
}
export interface IGetActiveElementsResponse {
  data: IActiveElementModel[];
  total_count: number;
  next_cursor: number[];
}

export interface IProcessHistoryModel {
  element_id: string;
  process_definition_key: number;
  bpmn_element_type: string;
  flow_scope_key: number;
  bpmn_event_type: string;
  parent_process_instance_key: number;
  parent_element_instance_key: number;
  version: number;
  process_instance_key: number;
  bpmn_process_id: string;
  intent: string;
  rejection_type: string;
  rejection_reason: string;
  tenant_id?: string;
  timestamp: Date;
}
export interface IGetProcessHistoryResponse {
  data: IProcessHistoryModel[];
  total_count: number;
  next_cursor: number[];
}

export interface IGetProcessHistoryBody {
  bpmnProcessId: string;
  processDefinitionKey?: number;
  processInstanceKey?: number[];
  limit?: number;
  offset?: number;
  sort?: { columnName: string; ascending: 'asc' | 'desc' }[];
  next_cursor?: string[];
  bpmnElementType?: string;
  intent?: string[];
}

export interface IGetUserTaskHistoryBody {
  bpmnProcessId: string;
  processDefinitionKey?: number;
  processInstanceKey?: number[];
  limit?: number;
  offset?: number;
  sort?: { columnName: string; ascending: 'asc' | 'desc' }[];
  next_cursor?: string[];
}

export interface IGetUserTaskHistoryResponse {
  data: IUserTaskHistoryModel[];
  total_count: number;
  next_cursor: number[];
}

interface IUserTaskHistoryModel {
  valueType: string;
  intent: TaskIntentType;
  rejectionType: string;
  rejectionReason: string;
  timestamp: Date;
  authorizations: {
    authorized_tenants: string[];
  };
  value: {
    processDefinitionVersion: number;
    elementId: string;
    processDefinitionKey: number;
    dueDate: string;
    formKey: number;
    followUpDate: string;
    userTaskKey: number;
    candidateUsersList: string[];
    creation_timestamp: Date;
    candidateGroupsList?: string[];
    changedAttributes?: string[];
    processInstanceKey: number;
    elementInstanceKey: number;
    tenantId: string;
    bpmnProcessId: string;
    variables?: Record<string, any>;
    action: string;
    assignee: string;
  };
}
