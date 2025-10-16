import { searchApiV2 } from '6_shared';

export const useGetSeverityProcess = () => {
  const { useLazyGetSeverityProcessesQuery } = searchApiV2;

  const createSeverityProcessBody = (newTmoId: number, newObjectId: string) => ({
    tmoId: newTmoId,
    columnFilters: [
      {
        columnName: 'id',
        rule: 'and',
        filters: [
          {
            operator: 'equals',
            value: newObjectId,
          },
        ],
      },
      {
        columnName: 'processInstanceId',
        rule: 'and',
        filters: [
          {
            operator: 'isNotEmpty',
            value: '',
          },
        ],
      },
    ],
  });

  const [getSeverityProcesses] = useLazyGetSeverityProcessesQuery();

  return { getSeverityProcesses, createSeverityProcessBody };
};
