import { useRef, useEffect, useState, useMemo } from 'react';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { SortValueType } from '6_shared';
import ClusterSortingStyleSelect from './ClusterSorting.styled';

interface IProps {
  disabled?: boolean;
  sortingList: SortValueType[] | undefined;
  selectedSort?: SortValueType | null;
  setSelectedSort?: (sort: SortValueType | null) => void;
}

export const ClusterSorting = ({
  disabled,
  setSelectedSort,
  selectedSort,
  sortingList,
}: IProps) => {
  const childRef = useRef<HTMLDivElement | null>(null);

  const [value, setValue] = useState(selectedSort?.label ?? '');

  useEffect(() => {
    if (selectedSort && selectedSort.label !== value) {
      setValue(selectedSort.label);
    }
  }, [selectedSort, value]);

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    const selectedOption =
      sortingList?.find((el) => el.label === e.target.value) ?? sortingList?.[0];
    if (selectedOption) {
      setSelectedSort?.(selectedOption);
    }
  };

  const menuItems = useMemo(
    () =>
      sortingList?.map((item) => (
        <MenuItem key={item.id} value={item.label}>
          {item.value}
        </MenuItem>
      )),
    [sortingList],
  );

  return (
    <ClusterSortingStyleSelect
      ref={childRef}
      disabled={disabled}
      value={value}
      onChange={handleChange}
      sx={{ minHeight: '35px', maxHeight: '40px' }}
    >
      {menuItems}
    </ClusterSortingStyleSelect>
  );
};
