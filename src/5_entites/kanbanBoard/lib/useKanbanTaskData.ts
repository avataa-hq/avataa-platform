import { useCallback, useEffect, useMemo, useState } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import {
  IGetParameterEventsByObjectId,
  IKanbanTask,
  InventoryObjectTypesModel,
  parameterTypesApi,
  SeverityProcessModelData,
} from '6_shared';
import { useGetObjectParametersEventsByObjectId } from '5_entites/inventory';

interface IProps {
  pmCurrentTMO?: InventoryObjectTypesModel | null;
  pmTableRows?: SeverityProcessModelData[] | null;
  statusTprmId?: number | null;
  skip?: boolean;
}

export const useKanbanTaskData = ({ pmCurrentTMO, pmTableRows, statusTprmId, skip }: IProps) => {
  const [issueTypeId, setIssueTypeId] = useState<number | null>(null);

  const { data: cachedData } = parameterTypesApi.endpoints.getObjectTypeParamTypes.useQueryState({
    id: pmCurrentTMO?.id!,
  });

  const objectIds = useMemo(() => {
    if (!pmTableRows) return [];

    return pmTableRows.reduce<number[]>((acc, item) => {
      if (item.status && typeof item.status === 'string' && item.status.trim() !== '') {
        acc.push(Number(item.id));
        return acc;
      }

      return acc;
    }, []);
  }, [pmTableRows]);

  const summaryTPRM = useMemo(() => {
    return cachedData?.find((paramType) => paramType.name.toLocaleLowerCase() === 'summary');
  }, [cachedData]);

  const assigneeTPRM = useMemo(() => {
    return cachedData?.find((paramType) => paramType.name.toLocaleLowerCase() === 'assignee');
  }, [cachedData]);

  useEffect(() => {
    if (!cachedData) return;
    const issueType = cachedData.find(
      (paramType) => paramType.name.toLocaleLowerCase() === 'issue type',
    );
    setIssueTypeId(issueType?.id ?? null);
  }, [cachedData]);

  const { objectParameterEventsData } = useGetObjectParametersEventsByObjectId({
    objectIds,
    sort: 'DESC',
    skip: skip || !objectIds.length,
  });

  const calculateDaysInColumn = useCallback(
    (historyData: IGetParameterEventsByObjectId[] | undefined) => {
      if (!historyData) return 0;

      const lastStatusUpdate = historyData.find((item) => item.parameter_type_id === statusTprmId);

      if (!lastStatusUpdate) return 0;

      const eventTime =
        typeof lastStatusUpdate.valid_from === 'string'
          ? parseISO(lastStatusUpdate.valid_from)
          : lastStatusUpdate.valid_from;

      return differenceInDays(new Date(), eventTime);
    },
    [statusTprmId],
  );

  const kanbanTasks: IKanbanTask[] = useMemo(() => {
    if (!pmTableRows?.length) return [];
    const kTasks: IKanbanTask[] = pmTableRows.reduce<IKanbanTask[]>((acc, item) => {
      if (item.status) {
        acc.push({
          ...item,
          daysInColumn: calculateDaysInColumn(objectParameterEventsData?.[item.id]?.data),
          tmoData: pmCurrentTMO,
          summary: item[summaryTPRM?.id ?? ''] ?? '',
          issueTypeId,
          assignee: item[assigneeTPRM?.id ?? ''] ?? null,
        });
      }
      return acc;
    }, []);

    return kTasks.sort(
      (a, b) => new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime(),
    );
  }, [
    pmTableRows,
    calculateDaysInColumn,
    objectParameterEventsData,
    pmCurrentTMO,
    summaryTPRM?.id,
    issueTypeId,
    assigneeTPRM?.id,
  ]);

  return { kanbanTasks };
};
