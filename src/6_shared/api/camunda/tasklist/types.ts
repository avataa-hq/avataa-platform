type TaskState = 'CREATED' | 'COMPLETED' | 'CANCELED';

export interface Task {
  id: string;
  name: string;
  taskDefinitionId: string;
  processName: string;
  creationTime: string;
  completionTime: string;
  assignee: string;
  taskState: TaskState;
  formKey: string;
  processDefinitionId: string;
  processInstanceKey: string;
  tenantId: string;
  dueDate: string;
  followUpDate: string;
  candidateGroups: string[];
  candidateUsers: string[];
}
