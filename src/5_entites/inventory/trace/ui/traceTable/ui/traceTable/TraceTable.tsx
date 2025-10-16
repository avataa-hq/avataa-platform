import { TextField } from '@mui/material';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { MutableRefObject, useState } from 'react';
import { FilterPanel } from '6_shared';

import * as SC from './TraceTable.styled';
import { useCommonTableColumns } from '../../hooks';

interface CommonTableProps {
  apiRef: MutableRefObject<GridApiPremium>;
  rows: Record<number, any>[];
  loading: boolean;
}

export const TraceTable = ({ apiRef, rows, loading }: CommonTableProps) => {
  const columns = useCommonTableColumns();

  const [paginationModel, setPaginationModel] = useState({
    pageSize: 50,
    page: 0,
  });

  return (
    <SC.TraceTableStyled
      columns={columns}
      rows={rows}
      apiRef={apiRef}
      loading={loading}
      pagination
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[50, 100, 150]}
      slots={{
        baseTextField: TextField,
        // @ts-expect-error
        filterPanel: FilterPanel,
      }}
    />
  );
};
