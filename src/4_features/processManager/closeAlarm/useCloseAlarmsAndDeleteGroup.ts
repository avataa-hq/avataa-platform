import { useGetObjectsOfGroup } from '5_entites';
import { PmSelectedRow } from '6_shared';
import { useCloseAlarm } from './useCloseAlarm';
import { useDeleteGroup } from '../grouping';

interface IProps {
  afterSuccessFn?: () => void;
}

export const useCloseAlarmsAndDeleteGroup = ({ afterSuccessFn }: IProps) => {
  const { getObjectsOfGroup } = useGetObjectsOfGroup();
  const { closeAlarm } = useCloseAlarm({ afterSuccessFn });
  const { deleteGroup } = useDeleteGroup();

  const closeAlarmsAndDeleteGroup = async (pmSelectedRows: PmSelectedRow[]) => {
    const groupNames: string[] = [];

    const selectedProcessDataIds = pmSelectedRows.map((item) => {
      if (item.groupName) {
        groupNames.push(item.groupName);
      }
      return Number(item.id);
    });

    if (groupNames.length !== 0) {
      const response = await getObjectsOfGroup(groupNames);
      if (response && response.data) {
        const allIds = Object.values(response.data).flat();
        if (allIds.length !== 0) {
          const idsToClose = Array.from(new Set([...selectedProcessDataIds, ...allIds]));
          await closeAlarm(idsToClose);
        } else {
          await closeAlarm(selectedProcessDataIds);
        }
        await deleteGroup(groupNames);
      }
    } else {
      await closeAlarm(selectedProcessDataIds);
    }
  };

  return { closeAlarmsAndDeleteGroup };
};
