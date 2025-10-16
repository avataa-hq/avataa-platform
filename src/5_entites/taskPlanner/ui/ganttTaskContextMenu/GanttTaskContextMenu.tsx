import { Menu, MenuItem } from '@mui/material';
import { IContextMenuPosition, useTranslate } from '6_shared';

interface IProps {
  handleClose: () => void;
  menuPosition: IContextMenuPosition | null;
  handleContextMenuItemClick: (menuType: string, taskId: string) => void;
}

export const GanttTaskContextMenu = ({
  handleClose,
  menuPosition,
  handleContextMenuItemClick,
}: IProps) => {
  const translate = useTranslate();

  return (
    <Menu
      id="layers-menu"
      open={Boolean(menuPosition)}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
      anchorReference="anchorPosition"
      aria-hidden={false}
      anchorPosition={
        menuPosition ? { top: menuPosition.mouseY, left: menuPosition.mouseX } : undefined
      }
    >
      <MenuItem
        onClick={() => {
          handleContextMenuItemClick('delete', menuPosition?.taskId ?? '');
          handleClose();
        }}
      >
        {translate('Delete')}
      </MenuItem>
    </Menu>
  );
};
