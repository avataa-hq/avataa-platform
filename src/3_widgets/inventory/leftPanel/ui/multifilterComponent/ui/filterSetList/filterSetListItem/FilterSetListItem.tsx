import VisibilityIcon from '@mui/icons-material/Visibility';
import { Typography, useTheme } from '@mui/material';
import { IFilterSetModel, ActionTypes } from '6_shared';
import { useState, MouseEvent, ReactNode } from 'react';
import { ThreeBody } from '@uiball/loaders';
import IconButton from '@mui/material/IconButton';
import {
  Center,
  FilterSetListItemStyled,
  HiddenButtonContainer,
  Left,
  Right,
} from './FilterSetListItem.styled';
import {
  ContextMenuModel,
  FilterSetItemContextMenu,
} from '../contextMenu/FilterSetItemContextMenu';

interface IProps extends IFilterSetModel {
  selected?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  permissions?: Record<ActionTypes, boolean>;

  onClick?: (filterSet: IFilterSetModel) => void;
  onContextMenu?: (filterSet: IFilterSetModel) => void;
  onFilterItemVisibleButtonClick?: (filterSet: IFilterSetModel) => void;

  onFilterSetItemContextMenuItemClick?: (itemType: 'add' | 'delete' | 'update' | 'copy') => void;
  setFilterItemLeftSlot?: (item: IFilterSetModel) => ReactNode;
  setFilterItemRightSlot?: (item: IFilterSetModel) => ReactNode;
  isSettingsMode?: boolean;
}

export const FilterSetListItem = ({
  selected = true,
  isLoading,
  isError,
  permissions,

  onClick,
  onContextMenu,
  onFilterSetItemContextMenuItemClick,
  onFilterItemVisibleButtonClick,

  setFilterItemLeftSlot,
  setFilterItemRightSlot,
  isSettingsMode,
  ...filterSet
}: IProps) => {
  const { name, owner } = filterSet;
  const { palette } = useTheme();

  const [contextMenu, setContextMenu] = useState<ContextMenuModel | null>(null);

  const onCTXMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onContextMenu?.(filterSet);

    setContextMenu(
      contextMenu === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 } : null,
    );
  };

  return (
    <>
      <FilterSetListItemStyled
        selected={!isSettingsMode ? selected : undefined}
        onContextMenu={(e) => onCTXMenu(e)}
      >
        {isSettingsMode && (
          <HiddenButtonContainer>
            <IconButton
              sx={{ padding: '0' }}
              onClick={() => {
                onFilterItemVisibleButtonClick?.(filterSet);
              }}
            >
              <VisibilityIcon
                fontSize="small"
                sx={{
                  fill: filterSet.hidden !== false ? palette.info.main : palette.primary.main,
                }}
              />
            </IconButton>
          </HiddenButtonContainer>
        )}
        <Left>{setFilterItemLeftSlot && setFilterItemLeftSlot(filterSet)}</Left>
        {isLoading && !isError && (
          <Center>
            <ThreeBody size={20} color={palette.primary.main} />
          </Center>
        )}
        {!isLoading && isError && (
          <Center>
            <Typography sx={{ opacity: 0.6 }} color="error">
              Error
            </Typography>
          </Center>
        )}
        <Center onClick={!isSettingsMode ? () => onClick?.(filterSet) : undefined}>
          <Typography>{name}</Typography>
        </Center>

        {!isSettingsMode && (
          <Right selected={selected}>
            {setFilterItemRightSlot && setFilterItemRightSlot(filterSet)}
          </Right>
        )}
      </FilterSetListItemStyled>
      <FilterSetItemContextMenu
        onFilterSetItemContextMenuItemClick={onFilterSetItemContextMenuItemClick}
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
        readonly={!owner}
        permissions={permissions}
      />
    </>
  );
};
