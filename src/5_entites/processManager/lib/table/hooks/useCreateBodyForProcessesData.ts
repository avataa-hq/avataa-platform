import { useEffect, useMemo, useState } from 'react';
import {
  ColumnFilter,
  DEFAULT_PAGINATION_MODEL,
  GetSeverityProcessBody,
  IFilterSetModel,
  useDebounceValue,
  useProcessManager,
  useProcessManagerTable,
} from '6_shared';
import { transformFilterSet } from '../../transformFilterSet';

const getFilterByGroup = (selectedGroup: string) => ({
  columnName: 'groups',
  rule: 'and',
  filters: [{ operator: 'equals', value: selectedGroup }],
});

interface IProps {
  selectedMultiFilter: IFilterSetModel | null;
  currentTmoId?: number | null;
  selectedGroup: string | null;
}

export const useCreateBodyForProcessesData = ({
  selectedMultiFilter,
  currentTmoId,
  selectedGroup,
}: IProps) => {
  const [severityProcessesBody, setSeverityProcessesBody] = useState<GetSeverityProcessBody | null>(
    null,
  );
  const { multiSearchValue } = useProcessManager();
  const { customSortingModel, customPaginationModel } = useProcessManagerTable();

  const customSortingModelItem = customSortingModel[currentTmoId ?? '-1'];
  const customPaginationModelItem = customPaginationModel[currentTmoId ?? '-1'];

  const searchValue = useDebounceValue(multiSearchValue);

  const sort = useMemo(() => {
    return (
      customSortingModelItem?.map((csm) => ({
        columnName: csm.field,
        ascending: csm.sort === 'asc',
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

  const columnFilters = useMemo<ColumnFilter[]>(() => {
    const result: ColumnFilter[] = [];

    if (selectedMultiFilter) {
      const filterSet = transformFilterSet(selectedMultiFilter);
      if (filterSet) {
        if (selectedGroup) {
          const withoutGroupNameFilter = filterSet.filter((f) => f.columnName !== 'groupName');
          result.push(...withoutGroupNameFilter, getFilterByGroup(selectedGroup));
        } else {
          result.push(...filterSet);
        }
      }
    }
    return result;
  }, [selectedGroup, selectedMultiFilter]);

  useEffect(() => {
    if (!currentTmoId) return;

    const body: GetSeverityProcessBody = {
      columnFilters,
      findByValue: searchValue,
      tmoId: currentTmoId,
      withGroups: selectedGroup === null,
      limit: pagination,
      sort,
    };

    setSeverityProcessesBody(body);
  }, [sort, searchValue, selectedGroup, currentTmoId, columnFilters, pagination]);

  return { severityProcessesBody };
};
