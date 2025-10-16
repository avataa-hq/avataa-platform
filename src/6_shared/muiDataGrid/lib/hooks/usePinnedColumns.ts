import { useCallback, useEffect } from 'react';
import { GridPinnedColumnFields } from '@mui/x-data-grid-premium';
import { GRID_CHECKBOX_SELECTION_FIELD } from '@mui/x-data-grid/colDef/gridCheckboxSelectionColDef';
import { CompositePinnedColumnsItem, HAS_FILE } from '../../model';

interface IProps {
  tmoId?: number;
  setPinnedColumns?: (value: CompositePinnedColumnsItem) => void;
  pinnedColumns?: Record<string, GridPinnedColumnFields>;
}

export const usePinnedColumns = ({ tmoId, setPinnedColumns, pinnedColumns }: IProps) => {
  const onPinnedColumnsChange = useCallback(
    (newModel: GridPinnedColumnFields) => {
      if (!tmoId || !pinnedColumns) return;

      const isHasFileColumnPinned = pinnedColumns[tmoId]?.left?.includes(HAS_FILE);
      const isCheckboxColumnPinned = pinnedColumns[tmoId]?.left?.includes(
        GRID_CHECKBOX_SELECTION_FIELD,
      );

      const leftColumns = newModel?.left ?? [];

      setPinnedColumns?.({
        tmoId,
        pinnedColumns: {
          left:
            isHasFileColumnPinned || isCheckboxColumnPinned
              ? newModel?.left
              : [GRID_CHECKBOX_SELECTION_FIELD, HAS_FILE, ...leftColumns],
          right: newModel?.right,
        },
      });
    },
    [pinnedColumns, setPinnedColumns, tmoId],
  );

  useEffect(() => {
    if (!tmoId || !pinnedColumns) return;

    if (
      JSON.stringify(pinnedColumns[tmoId]?.left) ===
      JSON.stringify([GRID_CHECKBOX_SELECTION_FIELD, HAS_FILE])
    ) {
      setPinnedColumns?.({
        tmoId,
        pinnedColumns: {
          left: [],
          right: pinnedColumns[tmoId]?.right || [],
        },
      });
    }
  }, [pinnedColumns, setPinnedColumns, tmoId]);

  return { onPinnedColumnsChange };
};
