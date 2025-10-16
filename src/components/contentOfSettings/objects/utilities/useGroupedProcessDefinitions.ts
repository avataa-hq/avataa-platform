import { useEffect, useState } from 'react';
import { processDefinitionApi, IProcessDefinition } from '6_shared';

const { useGetProcessDefinitionQuery } = processDefinitionApi;

type GroupedProcessDefinitions = Record<string, IProcessDefinition[]>;

export const useGroupedProcessDefinitions = () => {
  const { data } = useGetProcessDefinitionQuery({
    limit: 2000,
  });

  const [groupedProcessDefinitions, setGroupedProcessDefinitions] = useState(
    {} as GroupedProcessDefinitions,
  );

  useEffect(() => {
    if (!data) return;

    const groupedData = data.items.reduce((groups, item) => {
      const { bpmnProcessId } = item;

      if (item.name === 'DS Test') return groups;

      if (!groups[bpmnProcessId]) {
        groups[bpmnProcessId] = [];
      }

      groups[bpmnProcessId].push(item);

      return groups;
    }, {} as GroupedProcessDefinitions);

    setGroupedProcessDefinitions(groupedData);
  }, [data]);

  return groupedProcessDefinitions;
};
