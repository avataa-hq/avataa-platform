import { useCallback } from 'react';
import { GetExportedProcessesBody, searchApiV2 } from '6_shared';

const { useLazyGetExportedObjectsQuery } = searchApiV2;

export const useExportObjects = () => {
  const [getExportedTableData, { isFetching: isExportLoading, isError: isExportError }] =
    useLazyGetExportedObjectsQuery();

  const exportData = useCallback(
    (body: GetExportedProcessesBody) => {
      getExportedTableData(body);
    },
    [getExportedTableData],
  );

  return { exportData, isExportLoading, isExportError };
};
