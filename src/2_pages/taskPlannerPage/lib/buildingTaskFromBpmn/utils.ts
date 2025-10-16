import { addDays, addSeconds } from 'date-fns';
import { GantTaskType } from '6_shared';
import { BPMNItem } from './types';

function parseDuration(duration: string): number {
  const regex = /PT(\d+)(H|M|S)/;
  const match = duration.match(regex);

  if (!match) {
    throw new Error('Invalid duration format');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'H':
      return value * 3600; // часы в секунды
    case 'M':
      return value * 60; // минуты в секунды
    case 'S':
      return value; // уже в секундах
    default:
      throw new Error('Unsupported time unit');
  }
}

export const getBPMNItemDurationInSecond = (task: Record<string, any>) => {
  const extensionProps = task['bpmn:extensionElements'];
  if (!extensionProps) return null;
  const scheduling = extensionProps['zeebe:taskSchedule'];
  if (!scheduling) return null;
  const dueDate = scheduling['@_dueDate'];
  if (!dueDate) return null;
  const durationInSecond = parseDuration(dueDate);
  if (!durationInSecond) return null;
  return durationInSecond;
};

export const getTaskDuration = (
  taskStart: Date | undefined,
  taskType: GantTaskType,
  durationInSecond: number | null,
) => {
  if (!taskStart) return new Date();
  if (durationInSecond) return new Date(addSeconds(taskStart, durationInSecond));

  let durationDays = 0;
  if (taskType === 'project') durationDays = 5;
  if (taskType === 'task') durationDays = 1;
  if (taskType === 'milestone') durationDays = 0;
  return new Date(addDays(taskStart, durationDays));
};

export const getTaskType = (item: BPMNItem) => {
  if (item?.type === 'bpmn:subProcess') return 'project';
  if (item.type?.toLowerCase()?.includes('task')) return 'task';
  return 'milestone';
};

export const getBPMNFieldParticipantsToBuildTasks = (process: Record<string, any>) => {
  const allowedFields = new Set([
    'bpmn:exclusiveGateway',
    'bpmn:subProcess',
    'bpmn:startEvent',
    'bpmn:endEvent',
    // 'bpmn:parallelGateway',
  ]);
  const processKeys = Object.keys(process);
  processKeys.forEach((key) => {
    if (key.toLowerCase().includes('task')) allowedFields.add(key);
  });
  return allowedFields;
};
