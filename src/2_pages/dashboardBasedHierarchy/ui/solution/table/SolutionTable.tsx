import { useState } from 'react';
import { DataGridPremium, GridColDef, GridEventListener } from '@mui/x-data-grid-premium';
import { AGGREGATION_TYPES } from '6_shared/api/clickhouse/constants';
import { useGetEventNames } from '2_pages/dashboardBasedHierarchy/lib/useGetEventName';
import { extractEventName } from '2_pages/dashboardBasedHierarchy/lib/extractEventName';
import { InventoryAndHierarchyObjectTogether } from '6_shared';

const getColumns = (
  solutionData: any[],
  names: Record<string, string>,
): GridColDef<InventoryAndHierarchyObjectTogether>[] => {
  if (!solutionData || solutionData.length === 0) return [];

  const alwaysInclude = [
    { key: 'key', headerName: 'Key' },
    { key: 'child_count', headerName: 'Child count' },
  ];

  const allKeys = Object.keys(solutionData[0]);

  const alwaysIncludeKeys = alwaysInclude.map((item) => item.key);

  const filteredKeys = allKeys.filter(
    (key) =>
      AGGREGATION_TYPES.some((type) => key.startsWith(type)) ||
      alwaysIncludeKeys.includes(key) ||
      key.startsWith('mo_'),
  );

  const res = filteredKeys.map((field) => {
    const alwaysIncludeItem = alwaysInclude.find((item) => item.key === field);

    if (alwaysIncludeItem) {
      return { field, headerName: alwaysIncludeItem.headerName };
    }

    if (field.startsWith('mo_')) {
      return { field, headerName: field.replace(/^mo_/, '') };
    }

    const event = extractEventName(field);
    return { field, headerName: names?.[event] ?? event };
  });

  return res;
};

interface IProps {
  onRowClick?: (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    row: InventoryAndHierarchyObjectTogether,
  ) => void;
  onTableContextMenuClick?:
    | ((menuItem: string, row: InventoryAndHierarchyObjectTogether | null) => void)
    | undefined;
  solutionData: InventoryAndHierarchyObjectTogether[] | undefined;
}

export const SolutionTable = ({ onRowClick, onTableContextMenuClick, solutionData }: IProps) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  const names = useGetEventNames();

  if (!solutionData) {
    return null;
  }

  const columns = getColumns(solutionData, names);
  const handleRowClick: GridEventListener<'rowClick'> = (params, event) => {
    const row = params.row as InventoryAndHierarchyObjectTogether;
    onRowClick?.(event as React.MouseEvent<HTMLTableRowElement>, row);
  };

  return (
    <DataGridPremium
      pagination
      rows={solutionData}
      columns={columns}
      onRowClick={handleRowClick}
      onPaginationModelChange={setPaginationModel}
      paginationModel={paginationModel}
      pageSizeOptions={[10, 25, 50, 100]}
      sx={{
        '& .MuiDataGrid-columnHeaders': {
          minWidth: '100%',
        },
        '& .MuiDataGrid-row': {
          maxWidth: '100%',
        },
      }}
      columnBufferPx={20}
    />
  );
};
