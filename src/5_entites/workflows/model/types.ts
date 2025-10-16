export interface IBpmnIssue {
  category: string;
  id: string;
  message: string;
  meta?: string;
  path?: string[];
}
