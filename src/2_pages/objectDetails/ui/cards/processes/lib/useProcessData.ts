import { IInventoryObjectModel, processDefinitionApi, searchApiV2, userTaskApi } from '6_shared';
import { useMemo } from 'react';
import { ICurrentProcessElement } from '../ProcessDiagram';

const { useGetProcessDefinitionsXmlQuery } = processDefinitionApi;
const { useGetSeverityProcessesQuery } = searchApiV2;
const { useGetIncidentsQuery, useGetActiveElementsQuery } = userTaskApi;

interface IProps {
  objectId: number;
  inventoryObjectData?: IInventoryObjectModel;
}

export const useProcessData = ({ objectId, inventoryObjectData }: IProps) => {
  const { data: processes } = useGetSeverityProcessesQuery(
    {
      tmoId: inventoryObjectData?.tmo_id!,
      columnFilters: [
        {
          columnName: 'id',
          rule: 'and',
          filters: [{ operator: 'equals', value: objectId.toString() }],
        },
        {
          columnName: 'processInstanceId',
          rule: 'and',
          filters: [{ operator: 'isNotEmpty', value: '' }],
        },
      ],
    },
    { skip: !inventoryObjectData?.tmo_id || !objectId },
  );

  const lastProcess = processes?.rows?.[processes.rows.length - 1];

  const { data: processDefinitions, isFetching: isProcessDefinitionsFetching } =
    useGetProcessDefinitionsXmlQuery(lastProcess?.processDefinitionId!, {
      skip: !lastProcess?.processDefinitionId,
    });

  const { data: incidents, isFetching: isIncidentsFetching } = useGetIncidentsQuery(
    {
      bpmnProcessId: lastProcess?.processDefinitionKey!,
      processInstanceKey: lastProcess?.processInstanceId ? [lastProcess.processInstanceId] : [],
    },
    { skip: !lastProcess?.processDefinitionKey },
  );

  const { data: activeElements, isFetching: isActiveElementsFetching } = useGetActiveElementsQuery(
    {
      bpmnProcessId: lastProcess?.processDefinitionKey!,
      processInstanceKey: lastProcess?.processInstanceId ? [lastProcess.processInstanceId] : [],
    },
    { skip: !lastProcess?.processDefinitionKey },
  );

  const currentProcessElement: ICurrentProcessElement[] = useMemo(() => {
    if (activeElements && activeElements.data.length > 0) {
      return activeElements.data.flatMap((item) => {
        if (item.bpmn_element_type.toLowerCase().includes('process')) {
          return [];
        }
        return { taskId: item.element_id, type: 'success' };
      });
    }

    if (incidents && incidents.data.length > 0) {
      return incidents.data.map(({ value }) => ({ taskId: value.elementId, type: 'error' }));
    }

    return [];
  }, [activeElements, incidents]);

  return {
    isProcessDataLoading:
      isProcessDefinitionsFetching || isActiveElementsFetching || isIncidentsFetching,
    bpmnXMLDiagram: processDefinitions,
    currentProcessElement,
  };
};
