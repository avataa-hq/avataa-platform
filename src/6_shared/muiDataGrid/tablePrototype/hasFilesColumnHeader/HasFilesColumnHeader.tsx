import { useCallback } from 'react';
import { Checkbox } from '@mui/material';
import { GridColumnVisibilityModel, GridRowSelectionModel } from '@mui/x-data-grid-premium';
import { CompositeColumnsVisibilityItem, HAS_FILE } from '../../model';

interface IProps {
  isCheckboxSelection: boolean;
  visibleColumns?: Record<string, GridColumnVisibilityModel>;
  tmoId?: number;
  setIsCheckboxSelection: (isCheckboxSelection: boolean) => void;
  setColumnsVisibility: (value: CompositeColumnsVisibilityItem) => void;
  setSelectedRows: (arg: GridRowSelectionModel) => void;
  allRowIds: number[];
}

export const HasFilesColumnHeader = ({
  isCheckboxSelection,
  visibleColumns,
  tmoId,
  setIsCheckboxSelection,
  setColumnsVisibility,
  setSelectedRows,
  allRowIds,
}: IProps) => {
  const onChange = useCallback(() => {
    if (!visibleColumns || !tmoId || !allRowIds.length) return;

    setColumnsVisibility({
      tmoId,
      visibleColumns: {
        ...visibleColumns[tmoId],
        [HAS_FILE]: false,
      },
    });

    setIsCheckboxSelection(true);

    setSelectedRows(allRowIds);
  }, [
    allRowIds,
    setColumnsVisibility,
    setIsCheckboxSelection,
    setSelectedRows,
    tmoId,
    visibleColumns,
  ]);

  return (
    <Checkbox
      sx={{ zIndex: 100000, right: '10px' }}
      checked={isCheckboxSelection}
      onChange={onChange}
      data-testid="Inventory-table__header-checkbox"
    />
  );
};
