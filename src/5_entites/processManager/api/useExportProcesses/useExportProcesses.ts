import { useCallback } from 'react';
import { GetExportedProcessesBody, searchApiV2 } from '6_shared';

const { useLazyGetExportedProcessesQuery } = searchApiV2;

export const useExportProcesses = () => {
  const [getExportedTableData, { isLoading: isExportLoading, isError: isExportError }] =
    useLazyGetExportedProcessesQuery();

  const exportData = useCallback(
    (body: GetExportedProcessesBody) => {
      getExportedTableData(body);
    },
    [getExportedTableData],
  );

  return { exportData, isExportLoading, isExportError };
};
