import { IProcessHistoryModel } from '6_shared/api';

export type GantScaleType = 'days' | 'weeks' | 'months' | 'quarters' | 'years';

export interface IGantProcess {
  processDefinitionKey: string;
  processDefinitionId: number;
  processInstanceId: number;
  startDate?: Date | null;
}

export type GantTaskType = 'task' | 'project' | 'milestone';
export interface IGanttTask {
  id: number | string;
  start?: Date;
  end?: Date;
  name: string;
  progress?: number;
  type: GantTaskType;
  status?: string;
  dependencies?: string[];
  project?: string;
  color?: string;
  progressStart?: Date;
  progressEnd?: Date | null;
  isActive?: boolean;
  nodeData?: IProcessHistoryModel;
  nodeType?: string;
  taskDuration?: number;
  objectId?: string;
}

export interface ITimeLineTimeBorders {
  timeLineStartDate: Date;
  timeLineEndDate: Date;
}

interface ITimeLineSegmentItem {
  start: Date;
  end: Date;
  label: string;
  width: number;
}
export type TimeLineSegments = Record<GantScaleType, ITimeLineSegmentItem[]>;

export interface ICreateLineRef {
  strarLineConnectionIdRef: React.MutableRefObject<{
    startConnectionId: string;
    side: 'start' | 'end';
  } | null>;
  timeLineAreaRef: HTMLDivElement | null;
}

export interface IContextMenuPosition {
  mouseX: number;
  mouseY: number;
  taskId: string;
}

export interface IColorSegments {
  color: string;
  width: number;
}

export interface ILineRef {
  upadeLineTasks: (newTasks: IGanttTask[]) => void;
}

export interface ITaskPlannerDatesBorders {
  planStart: Date | null;
  planEnd: Date | null;
  factStart: Date | null;
  factEnd: Date | null;
}
