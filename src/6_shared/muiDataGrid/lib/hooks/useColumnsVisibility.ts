import { useCallback, useEffect } from 'react';
import { GridColumnVisibilityModel } from '@mui/x-data-grid-premium';
import { CompositeColumnsVisibilityItem } from '../../model';

interface IProps {
  tmoId?: number;
  visibleColumns: Record<string, GridColumnVisibilityModel>;
  defaultColumnVisibilityModel: GridColumnVisibilityModel;
  setColumnsVisibility: (value: CompositeColumnsVisibilityItem) => void;
}

export const useColumnsVisibility = ({
  tmoId,
  visibleColumns,
  defaultColumnVisibilityModel,
  setColumnsVisibility,
}: IProps) => {
  useEffect(() => {
    if (!tmoId) return;

    if (!visibleColumns[tmoId]) {
      setColumnsVisibility({
        tmoId,
        visibleColumns: defaultColumnVisibilityModel,
      });
    }
  }, [visibleColumns, tmoId, setColumnsVisibility, defaultColumnVisibilityModel]);

  const onColumnVisibilityModelChange = useCallback(
    (newModel: GridColumnVisibilityModel) => {
      if (!tmoId) return;

      setColumnsVisibility({
        tmoId,
        visibleColumns: newModel,
      });
    },
    [setColumnsVisibility, tmoId],
  );

  return { onColumnVisibilityModelChange };
};
