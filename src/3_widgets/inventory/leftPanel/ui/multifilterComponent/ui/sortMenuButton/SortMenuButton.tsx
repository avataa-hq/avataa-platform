import { ClickAwayListener, MenuItem, Typography, Button } from '@mui/material';
import { North, Sort, South } from '@mui/icons-material';

import { Box, useTranslate, CustomMenu, IFilterSetModelItem } from '6_shared';
import { useSortMenuActions } from './useSortMenuActions';

type IProps = {
  filterSetList?: IFilterSetModelItem[];
  setFilterSetList: (filterSetList: IFilterSetModelItem[]) => void;
  isSettingsMode?: boolean;
};

const SortMenuButton = ({ setFilterSetList, filterSetList, isSettingsMode }: IProps) => {
  const translate = useTranslate();
  const {
    isFilterSortOpen,
    setIsFilterSortOpen,
    onSortMenuClose,
    onSortMenuOpen,
    sortAscending,
    sortAscendingBySeverity,
    sortDescending,
    sortDescendingBySeverity,
  } = useSortMenuActions({ setFilterSetList, filterSetList });

  return (
    <ClickAwayListener onClickAway={onSortMenuClose}>
      <Button variant="contained.icon" onContextMenu={onSortMenuOpen} onClick={onSortMenuOpen}>
        <CustomMenu
          content={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <MenuItem onClick={sortAscending}>
                <Typography fontWeight="400">{translate('From A to Z')}</Typography>
              </MenuItem>
              <MenuItem onClick={sortDescending}>
                <Typography fontWeight="400">{translate('From Z to A')}</Typography>
              </MenuItem>
              {/* <MenuItem onClick={sortAscendingBySeverity}>
                <Typography fontWeight="400">{translate('Priority')}</Typography>
                <South fontSize="small" fontWeight="400" />
              </MenuItem>
              <MenuItem onClick={sortDescendingBySeverity}>
                <Typography fontWeight="400">{translate('Priority')}</Typography>
                <North fontSize="small" fontWeight="400" />
              </MenuItem> */}
            </Box>
          }
          open={isFilterSortOpen}
          setOpen={setIsFilterSortOpen}
          placement="bottom-start"
        >
          <Sort />
        </CustomMenu>
      </Button>
    </ClickAwayListener>
  );
};

export default SortMenuButton;
