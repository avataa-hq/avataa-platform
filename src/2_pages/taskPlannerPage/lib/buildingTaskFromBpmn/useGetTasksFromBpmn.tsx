import { useMemo, useRef, useState } from 'react';
import {
  IGantProcess,
  IGanttTask,
  IProcessHistoryModel,
  ITaskPlannerDatesBorders,
  parseBPMNTableToJSON,
  processDefinitionApi,
  userTaskApi,
} from '6_shared';
import { buildingTaskFromBpmn } from './buildingTaskFromBpmn';

const { useGetUserTaskQuery } = userTaskApi;

const { useGetProcessHistoryQuery } = userTaskApi;

const getTasksWithProcessCorrectProgressDuration = (tasks: IGanttTask[]) => {
  return tasks.map((tsk) => {
    if (tsk.type === 'project') {
      const nestedTasks = tasks.filter((t) => t.project === tsk.id);
      if (nestedTasks && nestedTasks.length) {
        const { startDates, endDates } = nestedTasks.reduce(
          (acc, task) => {
            if (task.start) {
              acc.startDates.push(task.start);
            }
            if (task.end) {
              acc.endDates.push(task.end);
            }
            return acc;
          },
          { startDates: [] as Date[], endDates: [] as Date[] },
        );

        const minDate = new Date(Math.min(...startDates.map((d) => d.getTime())));
        const maxDate = new Date(Math.max(...endDates.map((d) => d.getTime())));

        // const onlyTasks = nestedTasks.filter((t) => t.type !== 'milestone');
        // const averageProgress =
        //   onlyTasks.reduce((acc, t) => {
        //     if (t.progress != null) {
        //       // eslint-disable-next-line no-param-reassign
        //       acc += t.progress;
        //     }
        //     return acc;
        //   }, 0) / onlyTasks.length;

        return {
          ...tsk,
          progressStart: minDate,
          progressEnd: maxDate,
        };
      }
    }
    return tsk;
  });
};

interface IProps {
  selectedProcess: IGantProcess[];
}
export const useGetTasksFromBpmn = ({ selectedProcess = [] }: IProps) => {
  const { useGetProcessDefinitionsXmlQuery } = processDefinitionApi;

  const [projectName, setProjectName] = useState('');
  const [isRefetching, setIsRefetching] = useState(false);

  const lastProcess = selectedProcess?.[selectedProcess.length - 1];

  const dateBordersRef = useRef<ITaskPlannerDatesBorders>({
    planStart: null,
    planEnd: null,
    factStart: null,
    factEnd: null,
  });

  const { data: processDefinitionXml, isFetching: isProcessDefinitionFetching } =
    useGetProcessDefinitionsXmlQuery(lastProcess?.processDefinitionId!, {
      skip: !lastProcess?.processDefinitionId,
    });

  const {
    data: processHistory,
    isLoading: isLoadingProcessHistory,
    refetch: refetchProcessHistory,
  } = useGetProcessHistoryQuery(
    {
      bpmnProcessId: lastProcess?.processDefinitionKey!,
      processInstanceKey: lastProcess?.processInstanceId ? [lastProcess.processInstanceId] : [],

      sort: [{ columnName: 'timestamp', ascending: 'desc' }],
      limit: 10000,
      intent: ['ELEMENT_ACTIVATED', 'ELEMENT_COMPLETED'],
    },
    { skip: !lastProcess },
  );

  const {
    data: userTaskData,
    isFetching: isUserTaskFetching,
    refetch: refetchUserTask,
  } = useGetUserTaskQuery(
    {
      bpmnProcessId: lastProcess?.processDefinitionKey!,
      processDefinitionId: lastProcess?.processDefinitionId,
      with_variables: true,
      state: ['CREATED', 'COMPLETED'],
      sort: [{ columnName: 'creationTime', ascending: 'desc' }],
      limit: 1000,
    },
    {
      skip: !lastProcess,
    },
  );

  const additionalTaskData = useMemo(() => {
    if (!processHistory) return {};
    const { data } = processHistory;
    return data.reduce((acc, item) => {
      const { element_id } = item;
      if (!acc[element_id]) acc[element_id] = [];
      acc[element_id].push(item);
      return acc;
    }, {} as Record<string, IProcessHistoryModel[]>);
  }, [processHistory]);

  const tasksFromBpmn = useMemo(() => {
    if (!processDefinitionXml || isLoadingProcessHistory || isProcessDefinitionFetching) return [];

    const tableJSON = parseBPMNTableToJSON(processDefinitionXml ?? '');
    if (!tableJSON) return [];
    const process = tableJSON?.['bpmn:process'] as Record<string, any>;
    const bpmnTasks = buildingTaskFromBpmn(tableJSON, additionalTaskData, dateBordersRef);

    const correctedTasks = getTasksWithProcessCorrectProgressDuration(bpmnTasks);

    setProjectName(process['@_name'] ?? '');

    // return bpmnTasks;
    return correctedTasks;
  }, [
    additionalTaskData,
    isLoadingProcessHistory,
    isProcessDefinitionFetching,
    processDefinitionXml,
  ]);

  const refetchTasks = () => {
    setIsRefetching(true);
    setTimeout(() => {
      refetchProcessHistory();
      refetchUserTask();
      setIsRefetching(false);
    }, 5000);
  };

  const isLoadingGantt = useMemo(() => {
    return isProcessDefinitionFetching || isLoadingProcessHistory || isUserTaskFetching;
  }, [isProcessDefinitionFetching, isLoadingProcessHistory, isUserTaskFetching]);

  return {
    tasksFromBpmn,
    isLoadingGantt,
    projectName,
    userTaskData: userTaskData?.data,

    refetchTasks,
    isRefetching,

    dateBordersRef,
  };
};
