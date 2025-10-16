import { Menu, MenuItem } from '@mui/material';
import { useTranslate } from '6_shared';
import { useLayersContextMenu } from '../../hooks';

interface IProps {
  handleClose: () => void;
  menuPosition: {
    mouseX: number;
    mouseY: number;
  } | null;
}

export const LayersContextMenu = ({ handleClose, menuPosition }: IProps) => {
  const translate = useTranslate();
  const { handleLayerMenuItemClick } = useLayersContextMenu();

  return (
    <Menu
      id="layers-menu"
      open={Boolean(menuPosition)}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
      anchorReference="anchorPosition"
      anchorPosition={
        menuPosition ? { top: menuPosition.mouseY, left: menuPosition.mouseX } : undefined
      }
    >
      <MenuItem
        onClick={() => {
          handleLayerMenuItemClick('createFolder');
          handleClose();
        }}
      >
        {translate('Create folder')}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleLayerMenuItemClick('createLayer');
          handleClose();
        }}
      >
        {translate('Add layer')}
      </MenuItem>
    </Menu>
  );
};
