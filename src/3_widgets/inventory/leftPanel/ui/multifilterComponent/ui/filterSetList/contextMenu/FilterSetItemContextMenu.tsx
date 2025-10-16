import { MenuItem } from '@mui/material';
import Menu from '@mui/material/Menu';

import { useTranslate, ActionTypes } from '6_shared';

export type ContextMenuModel = { mouseX: number; mouseY: number };
interface IProps {
  contextMenu: ContextMenuModel | null;
  setContextMenu: (contextMenu: ContextMenuModel | null) => void;
  onFilterSetItemContextMenuItemClick?: (itemType: 'add' | 'delete' | 'update' | 'copy') => void;
  permissions?: Record<ActionTypes, boolean>;
  readonly?: boolean;
}
export const FilterSetItemContextMenu = ({
  contextMenu,
  setContextMenu,
  onFilterSetItemContextMenuItemClick,
  permissions,
  readonly,
}: IProps) => {
  const translate = useTranslate();

  const handleClose = (itemType: 'add' | 'delete' | 'update' | 'copy') => {
    onFilterSetItemContextMenuItemClick?.(itemType);
    setContextMenu(null);
  };

  return (
    <Menu
      open={contextMenu !== null}
      onClose={() => setContextMenu(null)}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
      }
    >
      <MenuItem
        disabled={!((readonly || permissions?.view) ?? true)}
        onClick={() => handleClose('update')}
      >
        {`${translate(readonly ? 'View' : 'Update')} ${translate('Multi Filter')}`}
      </MenuItem>
      {!readonly && (
        <MenuItem disabled={!(permissions?.view ?? true)} onClick={() => handleClose('delete')}>
          {`${translate('Delete')} ${translate('Multi Filter')}`}
        </MenuItem>
      )}
      <MenuItem disabled={!(permissions?.view ?? true)} onClick={() => handleClose('add')}>
        {`${translate('New')} ${translate('Multi Filter')}`}
      </MenuItem>
      <MenuItem disabled={!(permissions?.view ?? true)} onClick={() => handleClose('copy')}>
        {`${translate('Copy as New')} ${translate('Multi Filter')}`}
      </MenuItem>
    </Menu>
  );
};
