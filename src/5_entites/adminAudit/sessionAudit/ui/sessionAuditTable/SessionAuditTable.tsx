import { useState } from 'react';
import { GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid-pro';
import { Box } from '@mui/material';
import { LoadingOverlay, useLeftSidebar, useSidebar } from '6_shared';
import { StyledDataGrid } from './SessionAudit.styled';

interface IProps {
  rows: Record<string, any>[];
  columns: GridColDef[];
  paginationModel: GridPaginationModel;
  handlePaginationChange: (newModel: GridPaginationModel) => void;
  total?: number;
  isLoading: boolean;
}

export const SessionAuditTable = ({
  rows,
  columns,
  paginationModel,
  handlePaginationChange,
  total,
  isLoading,
}: IProps) => {
  const { isLeftSidebarOpen } = useLeftSidebar();
  const { isOpen } = useSidebar();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortModel(newSortModel);
  };

  return (
    <Box
      component="div"
      sx={{
        height: '100%',
        width:
          // eslint-disable-next-line no-nested-ternary
          isLeftSidebarOpen && !isOpen
            ? 'calc(100% - 170px)'
            : isLeftSidebarOpen && isOpen
            ? 'calc(100% - 191px)'
            : '100%',
        opacity: isLoading ? 0.5 : 1,
        overflow: 'auto',
      }}
    >
      <StyledDataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        pageSizeOptions={[20, 50, 100]}
        pagination
        paginationMode="server"
        rowCount={total || 0}
        sortingMode="client"
        sortModel={sortModel}
        loading={isLoading}
        onSortModelChange={handleSortModelChange}
        slots={{
          loadingOverlay: LoadingOverlay,
        }}
      />
    </Box>
  );
};
