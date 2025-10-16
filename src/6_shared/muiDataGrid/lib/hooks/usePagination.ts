import { useCallback, useEffect } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid-premium';
import { CompositePaginationItem } from '../../model/types';

interface IProps {
  tmoId?: number;
  pagination?: Record<string, GridPaginationModel>;
  defaultPaginationModel?: GridPaginationModel;
  setPagination?: (value: CompositePaginationItem) => void;
}

export const usePagination = ({
  tmoId,
  pagination,
  defaultPaginationModel,
  setPagination,
}: IProps) => {
  useEffect(() => {
    if (!tmoId) return;

    if (!pagination?.[tmoId] && defaultPaginationModel) {
      setPagination?.({
        tmoId,
        pagination: defaultPaginationModel,
      });
    }
  }, [pagination, tmoId, setPagination, defaultPaginationModel]);

  const changePaginationParam = useCallback(
    (value: number, param: keyof GridPaginationModel) => {
      if (tmoId && pagination && setPagination) {
        setPagination({ tmoId, pagination: { ...pagination[tmoId], [param]: value } });
      }
    },
    [pagination, setPagination, tmoId],
  );

  return {
    changePaginationParam,
  };
};
