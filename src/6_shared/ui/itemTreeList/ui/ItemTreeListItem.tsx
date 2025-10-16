import { ListItemIcon, ListItemButtonProps } from '@mui/material';

import { DraggableItemTreeListItem } from './DraggableItemTreeListItem';
import { ListItemButton, ListItemButtonActions, ListItemText } from './ItemTreeList.styled';

interface ItemTreeListItemProps extends ListItemButtonProps {
  isDraggable?: boolean;
  itemDragType?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  name?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const ItemTreeListItem = ({
  isDraggable,
  itemDragType = 'DRAG_ITEM',
  icon,
  name,
  actions,
  endAdornment,
  ...props
}: ItemTreeListItemProps) => {
  if (isDraggable)
    return (
      <DraggableItemTreeListItem
        itemDragType={itemDragType}
        icon={icon}
        name={name}
        actions={actions}
        {...props}
      />
    );

  return (
    <ListItemButton {...props}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{name}</ListItemText>
      <ListItemButtonActions
        component="div"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {actions}
      </ListItemButtonActions>
      {endAdornment}
    </ListItemButton>
  );
};
