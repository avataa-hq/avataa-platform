import { TextField } from '@mui/material';
import { NoRowsOverlay } from '5_entites/inventory/ui/table/noRowsOverlay/NoRowsOverlay';
import { MutableRefObject, useCallback } from 'react';
import { getRowClassName } from '6_shared/muiDataGrid/lib/getRowClassName';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { CustomPagination, PAGINATION_OPTIONS, useAssociatedObjects } from '6_shared';
import { GridPaginationModel } from '@mui/x-data-grid-premium';
import { useCommonTableColumns } from './useCommonTableColumns';
import { CommonViewStyled } from './CommonView.styled';

interface CommonTableProps {
  rows: Record<number, any>[];
  totalCount: number;
  apiRef?: MutableRefObject<GridApiPremium>;
}

export const CommonView = ({ rows, totalCount, apiRef }: CommonTableProps) => {
  const columns = useCommonTableColumns();

  const {
    commonView: { pagination },
    setCommonViewPagination,
  } = useAssociatedObjects();

  const changePaginationParam = useCallback(
    (value: number, param: keyof GridPaginationModel) => {
      setCommonViewPagination({
        ...pagination,
        [param]: value,
      });
    },
    [pagination],
  );

  return (
    <CommonViewStyled
      columns={columns}
      rows={rows}
      apiRef={apiRef}
      pagination
      paginationMode="server"
      getRowClassName={getRowClassName}
      slots={{
        baseTextField: TextField,
        pagination: CustomPagination,
        noRowsOverlay: NoRowsOverlay,
      }}
      slotProps={{
        pagination: {
          paginationLimit: pagination.pageSize,
          paginationOffset: pagination.page,
          changePaginationParam,
          paginationOptions: PAGINATION_OPTIONS,
          totalCount,
          isPagination: !!rows.length,
        },
      }}
    />
  );
};
