import { useEffect, useState } from 'react';
import { IFilterSetModel, IFilterSetModelItem, useLeftPanelWidget } from '6_shared';

const getLocalStorageFilterSet = (): IFilterSetModel | null => {
  const filterSetFromLocalStorage = localStorage.getItem('selectedMultiFilter');
  if (filterSetFromLocalStorage && filterSetFromLocalStorage !== 'null') {
    return JSON.parse(filterSetFromLocalStorage) as IFilterSetModel;
  }
  return null;
};

interface IProps {
  selectedMultiFilter: IFilterSetModel | null;
  allFilterSets?: IFilterSetModelItem[];
}
export const useRestoreFilterSet = ({ selectedMultiFilter, allFilterSets }: IProps) => {
  const [isNeedAutoSelect, setIsNeedAutoSelect] = useState(true);

  const { setSelectedMultiFilter } = useLeftPanelWidget();

  useEffect(() => {
    if (selectedMultiFilter) {
      localStorage.setItem('selectedMultiFilter', JSON.stringify(selectedMultiFilter));
    }
  }, [selectedMultiFilter]);

  useEffect(() => {
    if (!selectedMultiFilter && isNeedAutoSelect && allFilterSets && allFilterSets.length > 0) {
      const filterSetFromLocalStorage = getLocalStorageFilterSet();

      if (
        filterSetFromLocalStorage &&
        allFilterSets.some((e) => e.id === filterSetFromLocalStorage.id)
      ) {
        setSelectedMultiFilter(filterSetFromLocalStorage);
      }
      if (!filterSetFromLocalStorage) {
        setSelectedMultiFilter(allFilterSets[0]);
      }

      setIsNeedAutoSelect(false);
    }
  }, [selectedMultiFilter, allFilterSets, isNeedAutoSelect]);

  useEffect(
    () => () => {
      setSelectedMultiFilter(null);
      setIsNeedAutoSelect(true);
    },
    [],
  );
  return null;
};
