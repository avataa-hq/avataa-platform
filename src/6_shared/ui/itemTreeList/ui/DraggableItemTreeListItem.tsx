import { useDrag } from 'react-dnd';
import { ListItemIcon, ListItemText, ListItemButtonProps } from '@mui/material';

import { ListItemButton, ListItemButtonActions } from './ItemTreeList.styled';

// import { ListItemButton } from './ItemTreeList.styled';

interface DraggableItemTreeListItemProps extends ListItemButtonProps {
  itemDragType?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  name?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const DraggableItemTreeListItem = ({
  itemDragType = 'DRAG_ITEM',
  icon,
  name,
  actions,
  endAdornment,
  ...props
}: DraggableItemTreeListItemProps) => {
  const [, drag] = useDrag(() => ({
    // "type" is required. It is used by the "accept" specification of drop targets.
    type: itemDragType,
    // The collect function utilizes a "monitor" instance
    // to pull important pieces of state from the DnD system.
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <ListItemButton {...props} ref={drag}>
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
