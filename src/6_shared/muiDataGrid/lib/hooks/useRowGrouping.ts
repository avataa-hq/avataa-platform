import { useCallback } from 'react';
import { GridRowGroupingModel } from '@mui/x-data-grid-premium';
import { CompositeRowGroupingModel } from '../../model';

interface IProps {
  tmoId?: number;
  setRowGroupingModel?: (value: CompositeRowGroupingModel) => void;
}

export const useRowGrouping = ({ tmoId, setRowGroupingModel }: IProps) => {
  const onRowGroupingModelChange = useCallback(
    (value: GridRowGroupingModel) => {
      if (!tmoId) return;

      setRowGroupingModel?.({
        tmoId,
        rowGroupingModel: value,
      });
    },
    [tmoId, setRowGroupingModel],
  );

  return { onRowGroupingModelChange };
};
