import { MutableRefObject } from 'react';
import { isValid } from 'date-fns';
import { IGanttTask, IProcessHistoryModel, ITaskPlannerDatesBorders } from '6_shared';
import { getTaskDuration, getTaskType } from './utils';
import { getBPMNItemsListToBuildTasks } from './getBPMNItemsListToBuildTasks';

const MOCK_MIN_DATE_TIME_STAMP = 0;

const getStartEvent = (
  bpmnItemsList: Record<string, any>[],
  additionalTaskData?: Record<string, IProcessHistoryModel[]>,
): Task | null => {
  const startEvent = bpmnItemsList.find((item) => item.type === 'bpmn:startEvent');
  if (!startEvent) return null;

  let startDete: number | null = null;
  additionalTaskData?.[startEvent['@_id']]?.forEach((f) => {
    if (f.intent === 'ELEMENT_ACTIVATED') {
      startDete = Math.min(startDete ?? Infinity, new Date(f.timestamp).getTime());
    }
  });

  if (!startDete) return null;

  return {
    id: startEvent['@_id'],
    name: startEvent['@_name'] ?? startEvent['@_id'],
    start: new Date(startDete),
    end: new Date(startDete),
    nodeType: startEvent.type,
    nodeData: additionalTaskData?.[startEvent['@_id']]?.[0],
    progressStart: new Date(startDete),
    progressEnd: new Date(startDete),
    progress: 0,
    type: 'milestone',
  };
};

type Task = IGanttTask;

export const buildingTaskFromBpmn = (
  bpmnData: Record<string, any>,
  additionalTaskData?: Record<string, IProcessHistoryModel[]>,

  dateBordersRef?: MutableRefObject<ITaskPlannerDatesBorders>,
): Task[] => {
  const process = bpmnData?.['bpmn:process'] as Record<string, any>;
  const bpmnItemsListToBuildTasks = getBPMNItemsListToBuildTasks(process);

  const startEvent = getStartEvent(bpmnItemsListToBuildTasks, additionalTaskData);
  const gantTasks: Task[] = startEvent ? [startEvent] : [];

  if (startEvent?.start && dateBordersRef?.current) {
    dateBordersRef.current.planStart = startEvent.start;
    dateBordersRef.current.factStart = startEvent.start;
  }

  const getStartTaskDate = (item: Record<string, any>) => {
    if (!item.source?.length) return new Date();
    const sourceEndDates: number[] = [];
    item.source.forEach((s: string) => {
      const source = gantTasks.find((g) => g.id === s);

      const { end, progressEnd } = { ...source };

      const sourceEndDate = Math.max(end?.getTime() ?? 0, progressEnd?.getTime() ?? 0);

      if (sourceEndDate && isValid(sourceEndDate)) sourceEndDates.push(sourceEndDate);
    });

    return new Date(Math.max(...sourceEndDates));
  };

  const getStartTaskProgressDate = (item: Record<string, any>) => {
    let startData: Date | undefined;
    let endData: Date | undefined;
    let completed = false;
    const started = false;
    let isActive = false;

    // start date from additional date for PROGRESS ONLY
    const additionalData = additionalTaskData?.[item['@_id']];
    if (!additionalData || !additionalData.length) {
      return { startData, endData, completed, isActive };
    }

    if (additionalData.length % 2 === 0) completed = true;
    if (additionalData.length > 0 && additionalData.length % 2 !== 0) isActive = true;

    let createdDate = new Date(additionalData[0].timestamp).getTime();
    let completedDate = 0;

    additionalData?.forEach((d) => {
      if (d.intent === 'ELEMENT_ACTIVATED') {
        createdDate = Math.min(createdDate, new Date(d.timestamp).getTime());
      }
      if (d.intent === 'ELEMENT_COMPLETED') {
        completedDate = Math.max(completedDate, new Date(d.timestamp).getTime());
      }
    });

    if (createdDate && isValid(new Date(createdDate))) {
      startData = new Date(createdDate);
    }

    if (completedDate && isValid(new Date(completedDate))) {
      endData = new Date(completedDate);
    }

    return {
      startData,
      endData,
      completed,
      isActive,
    };
  };

  bpmnItemsListToBuildTasks.forEach((item) => {
    const taskType = getTaskType(item);

    const start = getStartTaskDate(item);
    if (!isValid(start)) return;
    const end = getTaskDuration(start, taskType, item.duration);
    if (!isValid(end)) return;

    const { endData, startData, completed, isActive } = getStartTaskProgressDate(item);

    const progressStart = startData;

    // const progressEnd = taskType === 'milestone' ? progressStart : endData ?? new Date();
    let progressEnd = endData;
    if (taskType === 'milestone') progressEnd = progressStart;
    if (!completed) progressEnd = new Date();

    const nodeData = additionalTaskData?.[item['@_id']]?.[0];

    const hasElm = gantTasks.find((g) => g.id === item['@_id']);

    if (dateBordersRef?.current) {
      if (progressEnd && isValid(progressEnd)) {
        dateBordersRef.current.factEnd = new Date(
          Math.max(
            !dateBordersRef.current.factEnd || !isValid(dateBordersRef.current.factEnd)
              ? MOCK_MIN_DATE_TIME_STAMP
              : dateBordersRef.current.factEnd.getTime(),
            progressEnd.getTime(),
          ),
        );
      }

      if (end && isValid(end)) {
        dateBordersRef.current.planEnd = new Date(
          Math.max(
            !dateBordersRef.current.planEnd || !isValid(dateBordersRef.current.planEnd)
              ? MOCK_MIN_DATE_TIME_STAMP
              : dateBordersRef.current.planEnd.getTime(),
            end.getTime(),
          ),
        );
      }
    }

    if (!hasElm) {
      gantTasks.push({
        id: item['@_id'],
        name: item['@_name'] ?? item['@_id'],
        type: taskType,
        start,
        end,
        dependencies: item.source,
        progressStart,
        progressEnd,
        isActive,
        nodeData,
        nodeType: item.type,
        project:
          taskType === 'project' || process['@_id'].includes('Process')
            ? undefined
            : process['@_id'],
      });
    }
  });

  const subProcesses = bpmnItemsListToBuildTasks.filter((item) => item.type === 'bpmn:subProcess');

  subProcesses?.forEach((pr: any) => {
    const nestedProcess = buildingTaskFromBpmn({ 'bpmn:process': pr }, additionalTaskData);
    const processIndex = gantTasks.findIndex((el) => el.id === pr['@_id']);
    gantTasks.splice(processIndex + 1, 0, ...nestedProcess);
  });
  return gantTasks;
};
