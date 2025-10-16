import {
  ColumnMenuPropsOverrides,
  GridColDef,
  GridColumnMenu,
  GridColumnMenuProps,
  GridColumnMenuSortItem,
  GridSortDirection,
} from '@mui/x-data-grid-premium';
import { MouseEvent } from 'react';
import { useColumnMenuPosition } from '../lib/hooks';

declare module '@mui/x-data-grid' {
  interface ColumnMenuPropsOverrides {
    onSortItemClick?: (sort: GridSortDirection, column: GridColDef) => void;
  }
}

const CustomSortMenuItem = ({
  colDef,
  onSortItemClick,
}: GridColumnMenuProps & ColumnMenuPropsOverrides) => {
  const itemProps = {
    colDef,
    onClick: (e: MouseEvent<HTMLUListElement>) => {
      let sort: GridSortDirection;
      if (e.currentTarget.innerText.includes('ASC')) sort = 'asc';
      if (e.currentTarget.innerText.includes('DESC')) sort = 'desc';
      onSortItemClick?.(sort, colDef);
    },
  };
  return <GridColumnMenuSortItem {...itemProps} />;
};
export const CustomColumnMenu = ({
  onSortItemClick,
  ...props
}: GridColumnMenuProps & ColumnMenuPropsOverrides) => {
  const isSmallScreen = window.innerHeight < 700;
  useColumnMenuPosition({ isMenuOpen: props.open, isSmallScreen });

  return (
    <GridColumnMenu
      {...props}
      slots={{ columnMenuSortItem: CustomSortMenuItem }}
      slotProps={{ columnMenuSortItem: { onSortItemClick } }}
    />
  );
};
