import { useCallback, useMemo } from 'react';
import {
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import {
  DataTransferFileExtension,
  DEFAULT_PAGINATION_MODEL,
  IFilterColumn,
  INestedMultiFilterForm,
} from '6_shared';
import { GridLogicOperator } from '@mui/x-data-grid';
import { useGetFiltersByColumns } from './useGetFiltersByColumns';
import { transformSortModel } from '../transformSortModel';

interface IProps {
  tmoId?: number;
  pagination: Record<string, GridPaginationModel>;
  sorting: Record<string, GridSortModel>;
  searchValue: Record<string, string>;
  isObjectsActive: boolean;
  additionalFilters?: IFilterColumn[];
  selectedFilter: Record<string, INestedMultiFilterForm>;
  withParentsData?: boolean;
  delimiter?: string;
  selectedRows?: GridRowSelectionModel;
}

export const useGetObjectsRequestBody = ({
  tmoId,
  pagination,
  sorting,
  searchValue,
  isObjectsActive,
  additionalFilters,
  selectedFilter,
  withParentsData,
  delimiter,
  selectedRows,
}: IProps) => {
  const { page, pageSize } = tmoId
    ? pagination[tmoId] || DEFAULT_PAGINATION_MODEL
    : DEFAULT_PAGINATION_MODEL;

  const sortModel = useMemo(
    () => transformSortModel(tmoId ? sorting[tmoId] : []),
    [sorting, tmoId],
  );

  const commonGetFiltersArgs = {
    tmoId,
    isObjectsActive,
    additionalFilters,
    selectedFilter,
  };

  const commonFiltersList = useGetFiltersByColumns({
    ...commonGetFiltersArgs,
  });

  const objectsByFiltersBody = useMemo(
    () => ({
      filter_columns: commonFiltersList,
      sort_by: sortModel,
      tmo_id: tmoId!,
      search_by_value: tmoId ? searchValue[tmoId] || null : null,
      limit: pageSize,
      offset: pageSize * page,
    }),
    [searchValue, page, pageSize, tmoId, sortModel, commonFiltersList],
  );

  const getSelectedRowsFilterForExport = () => {
    const selectedRowsFilter = selectedRows?.length
      ? [
          {
            columnName: 'id',
            rule: 'and' as GridLogicOperator,
            filters: [{ operator: 'isAnyOf', value: selectedRows }],
          },
        ]
      : [];

    if (additionalFilters) {
      return [...additionalFilters, ...selectedRowsFilter];
    }

    return selectedRowsFilter;
  };

  const exportFiltersListWithSelectedRows = useGetFiltersByColumns({
    ...commonGetFiltersArgs,
    additionalFilters: getSelectedRowsFilterForExport(),
  });

  const getExportBody = useCallback(
    (columns: string[], fileType: DataTransferFileExtension) => {
      return {
        tmo_id: tmoId!,
        find_by_value: tmoId ? searchValue[tmoId] || null : null,
        filters_list:
          exportFiltersListWithSelectedRows && exportFiltersListWithSelectedRows.length > 1
            ? exportFiltersListWithSelectedRows
            : commonFiltersList,
        sort: sortModel,
        columns,
        file_type: fileType,
        csv_delimiter: delimiter,
        with_parents_data: withParentsData,
      };
    },
    [
      delimiter,
      exportFiltersListWithSelectedRows,
      commonFiltersList,
      searchValue,
      sortModel,
      tmoId,
      withParentsData,
    ],
  );

  return { objectsByFiltersBody, getExportBody };
};
