import { IFilterSetModel, IInventoryFilterModel, INestedMultiFilterForm } from '6_shared';
import { useMemo } from 'react';

interface IProps {
  filterFromDataGrid?: INestedMultiFilterForm | null;
  selectedMultiFilter?: IFilterSetModel | null;
  hierarchyFilter?: IFilterSetModel | null;
}

export const useGetFilterSetFromTableAndMultiFilter = ({
  filterFromDataGrid,
  selectedMultiFilter,
  hierarchyFilter,
}: IProps) => {
  const currentMultiFilter = useMemo<IFilterSetModel | null>(() => {
    if (selectedMultiFilter) {
      return {
        ...selectedMultiFilter,
        filters: [...selectedMultiFilter.filters, ...(filterFromDataGrid?.columnFilters ?? [])],
      };
    }

    if (hierarchyFilter) {
      return {
        ...hierarchyFilter,
        filters: [...hierarchyFilter.filters, ...(filterFromDataGrid?.columnFilters ?? [])],
      };
    }
    if (filterFromDataGrid) {
      return {
        filters: filterFromDataGrid.columnFilters,
        id: 1,
        tmo_info: { id: null, name: 'string' },
        name: 'string',
        join_operator: 'and',
      };
    }

    return null;
  }, [selectedMultiFilter, filterFromDataGrid, hierarchyFilter]);

  const currentInventoryMultiFilter = useMemo<IInventoryFilterModel[]>(() => {
    if (!currentMultiFilter) return [];
    return currentMultiFilter.filters.map((f) => ({
      columnName: f.column.id,
      rule: f.logicalOperator,
      filters: f.filters,
    }));
  }, [currentMultiFilter]);

  return { currentMultiFilter, currentInventoryMultiFilter };
};
