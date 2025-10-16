import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_PAGINATION_MODEL,
  getErrorMessage,
  ICamundaUserTaskModel,
  InventoryObjectTypesModel,
  processDefinitionApi,
  ProcessManagerPageMode,
  useProcessManagerUserTasksTable,
  userTaskApi,
  useTabs,
} from '6_shared';
import { GridColDef } from '@mui/x-data-grid-pro';
import { enqueueSnackbar } from 'notistack';

const { useGetProcessDefinitionQuery } = processDefinitionApi;

const { useGetUserTaskQuery } = userTaskApi;

interface IProps {
  viewType: ProcessManagerPageMode;
  pmCurrentTmo: InventoryObjectTypesModel | null;
}
export const useUserTasksTableData = ({ pmCurrentTmo, viewType }: IProps) => {
  const { customSortingModel, customPaginationModel } = useProcessManagerUserTasksTable();

  const customSortingModelItem = customSortingModel[pmCurrentTmo?.id ?? '-1'];
  const customPaginationModelItem = customPaginationModel[pmCurrentTmo?.id ?? '-1'];

  const { selectedTab } = useTabs();

  const [hasError, setHasError] = useState(false);

  const sort = useMemo(() => {
    return (
      customSortingModelItem?.map((csm) => ({
        columnName: csm.field,
        ascending: csm.sort as 'asc' | 'desc',
      })) ?? []
    );
  }, [customSortingModelItem]);

  const pagination = useMemo(() => {
    const limitItem = customPaginationModelItem?.pageSize ?? DEFAULT_PAGINATION_MODEL.pageSize;
    const pageItem = customPaginationModelItem?.page ?? DEFAULT_PAGINATION_MODEL.page;

    return {
      limit: limitItem,
      offset: pageItem * limitItem,
    };
  }, [customPaginationModelItem?.page, customPaginationModelItem?.pageSize]);

  const bpmnProcessIdAndVersion = useMemo(() => {
    if (!pmCurrentTmo?.lifecycle_process_definition) return null;

    const [bpmnProcessId, version] = pmCurrentTmo.lifecycle_process_definition.split(':');

    return { bpmnProcessId, version: version != null ? +version : null };
  }, [pmCurrentTmo?.lifecycle_process_definition]);

  const { data: processDefinitionData } = useGetProcessDefinitionQuery(
    {
      filter_columns: bpmnProcessIdAndVersion?.bpmnProcessId
        ? { columnName: 'bpmnProcessId', value: bpmnProcessIdAndVersion.bpmnProcessId }
        : undefined,
    },
    { skip: !bpmnProcessIdAndVersion?.bpmnProcessId },
  );

  const processByVersion = useMemo(() => {
    if (!bpmnProcessIdAndVersion?.version || !processDefinitionData) return null;

    return processDefinitionData?.items.find(({ version }) => {
      return version === bpmnProcessIdAndVersion.version;
    });
  }, [bpmnProcessIdAndVersion?.version, processDefinitionData]);

  const {
    data: userTaskData,
    isFetching: isFetchingUserTaskData,
    isError,
    error,
    refetch: refetchUserTaskData,
  } = useGetUserTaskQuery(
    {
      bpmnProcessId: processByVersion?.bpmnProcessId!,
      ...(processByVersion?.key && { processDefinitionId: processByVersion?.key }),
      with_variables: true,
      sort,
      limit: pagination.limit,
      offset: pagination.offset,
    },
    {
      skip: viewType !== 'tasks' || !processByVersion?.bpmnProcessId,
      pollingInterval: hasError || selectedTab !== 'processManager' ? undefined : 3140,
    },
  );

  useEffect(() => {
    setHasError(isError);

    return () => {
      setHasError(false);
    };
  }, [isError]);

  const userTaskColumns: GridColDef[] = useMemo(() => {
    const result: GridColDef[] = [];
    Object.keys(userTaskData?.data[0] ?? {}).forEach((key) => {
      if (key !== 'variables') {
        result.push({ field: key, headerName: key, flex: 1, minWidth: 100 });
      }
    });

    return [...result, { field: 'objectName', headerName: 'Object name', flex: 1, minWidth: 100 }];
  }, [userTaskData?.data]);

  useEffect(() => {
    if (isError) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  }, [error, isError]);

  const rows = useMemo(() => {
    if (isError) return [];
    const result: (ICamundaUserTaskModel & { objectName?: string | null })[] = [];

    userTaskData?.data?.forEach((item) => {
      const vars = item.variables as { name: string; value: any }[] | undefined;
      const objectName = vars?.find((v) => v.name === 'name' && v.value)?.value;

      result.push({
        ...item,
        objectName,
      });
    });

    return result;
  }, [isError, userTaskData?.data]);

  return {
    userTaskColumns,
    useTasksTotalRows: userTaskData?.total ?? 0,
    userTaskRows: rows,
    userTaskError: hasError,
    isFetchingUserTaskData,
    refetchUserTaskData,
  };
};
