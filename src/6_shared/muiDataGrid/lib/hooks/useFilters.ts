import { useCallback } from 'react';
import { CompositeFiltersItem, CompositeIsCustomFilters, INestedMultiFilterForm } from '6_shared';

interface IProps {
  tmoId?: number;
  setTableFilters: (value: CompositeFiltersItem) => void;
  setIsCustomFilters?: (value: CompositeIsCustomFilters) => void;
}

export const useFilters = ({ tmoId, setTableFilters, setIsCustomFilters }: IProps) => {
  const setFilters = useCallback(
    (newModel: INestedMultiFilterForm) => {
      if (!tmoId) return;

      setTableFilters({ tmoId, selectedFilter: newModel });

      if (setIsCustomFilters) {
        setIsCustomFilters({ tmoId, isCustomFiltersSetActive: false });
      }
    },
    [setIsCustomFilters, setTableFilters, tmoId],
  );

  const removeFilters = useCallback(() => {
    if (!tmoId) return;

    setTableFilters({
      tmoId,
      selectedFilter: { columnFilters: [] },
    });
    if (setIsCustomFilters) {
      setIsCustomFilters({ tmoId, isCustomFiltersSetActive: false });
    }
  }, [setIsCustomFilters, setTableFilters, tmoId]);

  return { setFilters, removeFilters };
};
