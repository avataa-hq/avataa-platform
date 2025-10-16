import { useState } from 'react';

import { GetSeverityProcessBody, searchApiV2, groupApi } from '6_shared';
import { useGetObjectsOfGroup, useGetRangesForProcessesBody } from '5_entites';
import { useCloseAlarm } from '4_features';

const { useDeleteGroupMutation } = groupApi;

interface IProps {
  severityProcessesBody: GetSeverityProcessBody | null;
  tableTotalCount?: number;
}

const { useLazyGetSeverityProcessesQuery } = searchApiV2;

export const useCloseProcessesAndDeleteGroups = ({
  severityProcessesBody,
  tableTotalCount,
}: IProps) => {
  const [processesIdsToClose, setProcessesIdsToClose] = useState<number[]>([]);
  const [groupNamesToDelete, setGroupNamesToDelete] = useState<string[]>([]);

  const { getObjectsOfGroup } = useGetObjectsOfGroup();
  const { closeAlarm } = useCloseAlarm({});
  const [deleteGroups] = useDeleteGroupMutation();

  const { getRangesForProcessesBody } = useGetRangesForProcessesBody();

  const [getProcesses, { isFetching: isFetchingProcesses }] = useLazyGetSeverityProcessesQuery();

  const getProcessesAndGroupsData = async () => {
    if (severityProcessesBody === null) return;
    const processData = await getProcesses({
      ...severityProcessesBody,
      rangesObject: {
        ranges: getRangesForProcessesBody(false),
      },
      limit: { limit: tableTotalCount, offset: 0 },
    }).unwrap();

    if (!processData) return;
    const newGroupNames: string[] = [];

    const currentTableProcessDataIds = processData.rows.reduce((acc: number[], item) => {
      if (item.groupName) {
        newGroupNames.push(item.groupName);
      }
      if (!item.endDate) {
        acc.push(Number(item.id));
      }
      return acc;
    }, []);

    setProcessesIdsToClose(currentTableProcessDataIds);

    if (newGroupNames.length !== 0) {
      setGroupNamesToDelete(newGroupNames);
      const objectsOfGroupsResponse = await getObjectsOfGroup(newGroupNames);

      if (objectsOfGroupsResponse && objectsOfGroupsResponse.data) {
        const allIds = Object.values(objectsOfGroupsResponse.data).flat();

        const idsToClose = Array.from(new Set([...currentTableProcessDataIds, ...allIds]));

        setProcessesIdsToClose(idsToClose);
      }
    } else {
      setGroupNamesToDelete([]);
    }
  };

  const closeProcessesAndDeleteGroups = async () => {
    if (processesIdsToClose.length !== 0) {
      await closeAlarm(processesIdsToClose);
    }
    if (groupNamesToDelete.length !== 0) {
      await deleteGroups(groupNamesToDelete);
    }
  };

  return {
    getProcessesAndGroupsData,
    closeProcessesAndDeleteGroups,
    processesCountWithoutEndDate: processesIdsToClose.length,
    groupsCount: groupNamesToDelete.length,
    isFetchingProcesses,
  };
};
