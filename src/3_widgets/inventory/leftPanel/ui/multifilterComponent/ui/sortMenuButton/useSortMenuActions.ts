import { IFilterSetModelItem } from '6_shared';
import { useState } from 'react';

type IProps = {
  filterSetList?: IFilterSetModelItem[];
  setFilterSetList: (filterSetList: IFilterSetModelItem[]) => void;
};

export const useSortMenuActions = ({ setFilterSetList, filterSetList }: IProps) => {
  const [isFilterSortOpen, setIsFilterSortOpen] = useState<boolean>(false);

  const onSortMenuOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsFilterSortOpen(true);
  };

  const onSortMenuClose = (event: MouseEvent | TouchEvent) => {
    // event.preventDefault();
    setIsFilterSortOpen(false);
  };

  const sortAscending = () => {
    if (!filterSetList) return;
    const sortedArray = [...filterSetList].sort((a, b) => a.name.localeCompare(b.name));
    setFilterSetList(sortedArray);
    setIsFilterSortOpen(false);
  };

  const sortAscendingBySeverity = () => {
    if (!filterSetList) return;
    const sortedArray = [...filterSetList].sort((a, b) => {
      if (a.maxSeverity && b.maxSeverity) {
        return b.maxSeverity - a.maxSeverity;
      }
      return 0;
    });
    setFilterSetList(sortedArray);
    setIsFilterSortOpen(false);
  };

  const sortDescendingBySeverity = () => {
    if (!filterSetList) return;
    const sortedArray = [...filterSetList].sort((a, b) => {
      if (a.maxSeverity && b.maxSeverity) {
        return a.maxSeverity - b.maxSeverity;
      }
      return 0;
    });
    setFilterSetList(sortedArray);
    setIsFilterSortOpen(false);
  };

  const sortDescending = () => {
    if (!filterSetList) return;
    const sortedArray = [...filterSetList].sort((b, a) => a.name.localeCompare(b.name));
    setFilterSetList(sortedArray);
    setIsFilterSortOpen(false);
  };

  return {
    isFilterSortOpen,
    setIsFilterSortOpen,
    onSortMenuOpen,
    onSortMenuClose,
    sortAscending,
    sortDescending,
    sortAscendingBySeverity,
    sortDescendingBySeverity,
  };
};
