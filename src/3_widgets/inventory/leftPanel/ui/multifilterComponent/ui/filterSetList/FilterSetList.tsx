import { ReactNode, useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Switch, Typography } from '@mui/material';

import { IFilterSetModel, LoadingAvataa, ActionTypes, Button } from '6_shared';

import { AddFilterButtonBlock, FilterSetListStyled, SettingsHeader } from './FilterSetList.styled';
import { FilterSetListItem } from './filterSetListItem/FilterSetListItem';

interface IProps {
  onFilterItemClick?: (filterSet: IFilterSetModel) => void;
  onFilterItemContextMenu?: (filterSet: IFilterSetModel) => void;
  onFilterSetItemContextMenuItemClick?: (itemType: 'add' | 'delete' | 'update' | 'copy') => void;
  onFilterItemVisibleButtonClick?: (filterSet: IFilterSetModel) => void;
  onShowOrHideAll?: (mode: 'show' | 'hide') => void;

  selectedFilterSet?: IFilterSetModel | null;
  filterSetList?: IFilterSetModel[];
  permissions?: Record<ActionTypes, boolean>;

  isLoadingItemData?: boolean;
  isErrorItemData?: boolean;
  isShowPrivateOnly?: boolean;

  isLoadingList?: boolean;
  isErrorList?: boolean;
  isSettingsMode?: boolean;

  setFilterItemLeftSlot?: (item: IFilterSetModel) => ReactNode;
  setFilterItemRightSlot?: (item: IFilterSetModel) => ReactNode;
}

export const FilterSetList = ({
  onFilterItemClick,
  onFilterItemContextMenu,
  onFilterSetItemContextMenuItemClick,
  onFilterItemVisibleButtonClick,
  selectedFilterSet,
  filterSetList,
  permissions,

  isLoadingItemData,
  isErrorItemData,

  isLoadingList,
  isErrorList,
  isSettingsMode,
  isShowPrivateOnly,

  setFilterItemLeftSlot,
  setFilterItemRightSlot,
}: IProps) => {
  const visibleOrHiddenFilters = useMemo(() => {
    if (!filterSetList) return [];
    // if (isSettingsMode) return filterSetList;
    // return filterSetList.filter((fs) => fs.hidden === null || !fs.hidden);

    if (isShowPrivateOnly) {
      return filterSetList.filter((f) => !f.public);
    }
    return filterSetList;
  }, [filterSetList, isShowPrivateOnly]);

  return (
    <>
      {/* {isSettingsMode && ( */}
      {/*  <SettingsHeader> */}
      {/*    <Button onClick={() => onShowOrHideAll?.('hide')}>Hide all</Button> */}
      {/*    <Button onClick={() => onShowOrHideAll?.('show')}>Show all</Button> */}
      {/*  </SettingsHeader> */}
      {/* )} */}
      <FilterSetListStyled sx={{ position: 'relative', minHeight: 100 }}>
        {isLoadingList && (
          <FilterSetListStyled sx={{ position: 'absolute' }}>
            <LoadingAvataa />
          </FilterSetListStyled>
        )}
        {visibleOrHiddenFilters.map((i) => (
          <FilterSetListItem
            {...i}
            key={i.id}
            isLoading={isLoadingItemData}
            isError={isErrorItemData}
            selected={selectedFilterSet?.id === i.id}
            onClick={onFilterItemClick}
            onContextMenu={onFilterItemContextMenu}
            onFilterSetItemContextMenuItemClick={onFilterSetItemContextMenuItemClick}
            setFilterItemLeftSlot={setFilterItemLeftSlot}
            setFilterItemRightSlot={setFilterItemRightSlot}
            permissions={permissions}
            onFilterItemVisibleButtonClick={onFilterItemVisibleButtonClick}
            isSettingsMode={isSettingsMode}
          />
        ))}
      </FilterSetListStyled>
    </>
  );
};
