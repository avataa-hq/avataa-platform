import { useMemo } from 'react';
import { GridLogicOperator } from '@mui/x-data-grid';
import { IFilterColumn, INestedMultiFilterForm } from '6_shared';

interface IProps {
  tmoId?: number;
  isObjectsActive?: boolean;
  additionalFilters?: IFilterColumn[];
  selectedFilter?: Record<string, INestedMultiFilterForm>;
}

export const useGetFiltersByColumns = ({
  tmoId,
  isObjectsActive,
  additionalFilters,
  selectedFilter,
}: IProps) => {
  const columnFilters = useMemo<IFilterColumn[]>(() => {
    if (!tmoId || !selectedFilter?.[tmoId]) return [];

    return selectedFilter[tmoId].columnFilters.map((f) => ({
      columnName: f.column.id,
      filters: f.filters,
      rule: f.logicalOperator as any,
    }));
  }, [selectedFilter, tmoId]);

  const filtersList = useMemo(() => {
    const filterCols = [
      ...columnFilters,
      {
        columnName: 'active',
        rule: 'and' as GridLogicOperator,
        filters: [
          {
            operator: 'equals',
            value: String(isObjectsActive),
          },
        ],
      },
    ];

    if (additionalFilters && additionalFilters.length) {
      additionalFilters.forEach((item) => filterCols.push(item));
    }

    return filterCols;
  }, [columnFilters, isObjectsActive, additionalFilters]);

  return filtersList;
};
