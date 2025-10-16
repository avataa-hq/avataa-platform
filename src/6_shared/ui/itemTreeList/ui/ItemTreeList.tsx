import { useState } from 'react';

import {
  FolderOpenRounded,
  InsertDriveFileRounded,
  KeyboardArrowDownRounded,
  MoreHorizRounded,
} from '@mui/icons-material';
import { Box, Divider, ListItemButton, Menu, MenuItem } from '@mui/material';

import { LoadingAvataa } from '6_shared';

import { ItemTreeListProps } from '../model/types';
import { ItemTreeListContainer } from './ItemTreeList.styled';
import { ItemTreeListItem } from './ItemTreeListItem';

export const ItemTreeList = <T extends Record<string, any>>({
  items,
  activeItem,
  onItemClick,
  onItemDoubleClick,
  onItemContextMenu,
  itemKeyAsId = 'id',
  getItemId = (i: T) => i[itemKeyAsId],
  getItemIcon,
  getItemName,
  getItemActions,
  getItemEndAdornment,
  itemIsDraggable = false,
  itemDragType = 'BOX',
  isLoading = false,

  parents = [],
  onParentClick,
  onRootClick = onParentClick,
  getParentId,
  getParentName,
  getParentActions,
  getParentIcon,
  displayRoot = false,
  permissions,
}: ItemTreeListProps<T>) => {
  const [selectedItemId, setSelectedItemId] = useState<string | number>();
  const [anchorElHierarchyPath, setAnchorElHierarchyPath] = useState<null | HTMLElement>(null);
  const openHierarchyPath = Boolean(anchorElHierarchyPath);

  const parentsWithRoot: T[] = [{ [itemKeyAsId]: 'root', name: 'Root' } as any, ...parents];

  const onHierarchyPathClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorElHierarchyPath(event.currentTarget);
  };

  if (isLoading) {
    return (
      <Box
        component="div"
        width="100%"
        height="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <LoadingAvataa />
      </Box>
    );
  }

  return (
    <ItemTreeListContainer>
      <Box component="div" flex={1} overflow="auto">
        {items?.map((item) => (
          <ItemTreeListItem
            key={getItemId(item)}
            onClick={(event) => {
              if (!activeItem) setSelectedItemId(getItemId(item));
              onItemClick?.(event, item);
            }}
            onDoubleClick={(event) => onItemDoubleClick?.(event, item)}
            onContextMenu={(event) => onItemContextMenu?.(event, item)}
            selected={
              activeItem
                ? getItemId(activeItem) === getItemId(item)
                : getItemId(item) === selectedItemId
            }
            icon={
              (typeof getItemIcon === 'function' ? getItemIcon?.(item) : getItemIcon) || (
                <InsertDriveFileRounded />
              )
            }
            name={getItemName?.(item) || item.name || item.key}
            actions={getItemActions?.(item)}
            itemDragType={itemDragType}
            isDraggable={
              typeof itemIsDraggable === 'function' ? itemIsDraggable(item) : itemIsDraggable
            }
            data-testid={item?.name?.startsWith('at_') ? `${item.name}_container` : undefined}
            endAdornment={getItemEndAdornment?.(item)}
          />
        ))}
      </Box>
      {(displayRoot || parents.length > 0) && (
        <Box component="div">
          <Divider />
          {parentsWithRoot.length > 3 && (
            <>
              <ListItemButton onClick={onHierarchyPathClick}>
                <MoreHorizRounded sx={{ mx: 'auto' }} />
              </ListItemButton>
              <Menu
                anchorEl={anchorElHierarchyPath}
                open={openHierarchyPath}
                onClose={() => setAnchorElHierarchyPath(null)}
                MenuListProps={{ 'aria-labelledby': 'basic-button' }}
              >
                {parentsWithRoot.map((parentItem: T) => (
                  <MenuItem
                    key={getParentId?.(parentItem) ?? getItemId(parentItem)}
                    onClick={(event: React.SyntheticEvent) => {
                      onParentClick?.(event, parentItem);
                      setAnchorElHierarchyPath(null);
                    }}
                  >
                    <FolderOpenRounded color="secondary" />
                    <Box component="div" sx={{ padding: '0 20px' }}>
                      {getParentName?.(parentItem) ||
                        getItemName?.(parentItem) ||
                        parentItem.name ||
                        parentItem.key}
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
          {parentsWithRoot
            .slice(
              parentsWithRoot.length > 3 ? parentsWithRoot.length - 3 : 0,
              parentsWithRoot.length,
            )
            .map((parentItem, i) => (
              <ItemTreeListItem
                key={i === 0 ? parentItem.id : getParentId?.(parentItem) ?? getItemId(parentItem)}
                onClick={(event) =>
                  parentItem[itemKeyAsId] === 'root'
                    ? onRootClick?.(event, parentItem)
                    : onParentClick?.(event, parentItem)
                }
                icon={
                  getParentIcon?.(parentItem) || (
                    <>
                      <KeyboardArrowDownRounded sx={{ marginRight: '10px' }} />
                      <FolderOpenRounded sx={{ marginRight: '5px' }} />
                    </>
                  )
                }
                name={getParentName?.(parentItem) || parentItem.name || parentItem.key}
                actions={getParentActions?.(parentItem)}
              />
            ))}
        </Box>
      )}
    </ItemTreeListContainer>
  );
};
