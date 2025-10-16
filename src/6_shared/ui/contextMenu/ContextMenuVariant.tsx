import { Menu, MenuItem, Fade, MenuList } from '@mui/material';
import { ReactNode } from 'react';

export interface IMenuItem {
  item: string | null;
  action?: (arg?: any) => void;
  disabled?: boolean;
}

export interface IMenuPosition {
  mouseX: number;
  mouseY: number;
}

interface IInventoryContextMenu {
  contextMenu?: IMenuPosition | null;
  handleClose: () => void;
  menuItems?: IMenuItem[];
  contentComponent?: ReactNode;
}

export const ContextMenuVariant = ({
  contextMenu,
  handleClose,
  menuItems,
  contentComponent,
}: IInventoryContextMenu) => {
  const renderMenuItems = () => {
    return menuItems?.map((listItem, idx) => {
      const { item, action, disabled } = listItem;
      const onClick = () => {
        handleClose();
        action?.();
      };
      if (item)
        return (
          <MenuItem onClick={onClick} disabled={disabled} key={idx}>
            {item}
          </MenuItem>
        );
      return null;
    });
  };

  return (
    <Menu
      sx={{
        '.MuiMenu-paper': {
          overflow: 'visible !important',
        },
      }}
      slotProps={{
        paper: { 'data-testid': 'inventory__context-menu' } as any,
      }}
      TransitionComponent={Fade}
      transitionDuration={600}
      open={!!contextMenu}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
      }
      componentsProps={{
        root: {
          onContextMenu: (e) => {
            e.preventDefault();
            handleClose();
          },
        },
      }}
    >
      {menuItems?.length && <MenuList autoFocus>{renderMenuItems()}</MenuList>}
      {contentComponent}
    </Menu>
  );
};
