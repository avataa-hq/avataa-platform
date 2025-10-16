import { alpha, Checkbox, IconButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { useEffect } from 'react';
import { IListItemData, useLayersSlice } from '6_shared';
import * as SC from './LayersLisItem.styled';

interface DragItem {
  id: number;
  type: 'folder' | 'layer';
}

interface IProps {
  listItem: IListItemData;
  onClick?: (newListItem: IListItemData, action: 'edit' | 'delete') => void;
  onFolderDoubleClick?: (newListItem: IListItemData) => void;
  handleCheckLayerChange?: (checked: boolean, layerId: number) => void;
  onStartDrag?: (itemId: number | null) => void;
}
export const LayersListItem = ({
  listItem,
  onClick,
  onFolderDoubleClick,
  handleCheckLayerChange,
  onStartDrag,
}: IProps) => {
  const { id, name, type, icon } = listItem;

  const theme = useTheme();

  const { setDropFolder, setIsConfirmModalOpen, setSelectedLayersItem } = useLayersSlice();

  const [, dragRef] = useDrag({
    type: 'folder',
    item: { id, name, type },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    isDragging: (monitor) => {
      onStartDrag?.(monitor.getItem().id);
      return monitor.getItem().id === id;
    },

    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        onStartDrag?.(null);
      }
    },
  });

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: 'folder',
    canDrop: (item: DragItem) => {
      if (item.type === 'folder' && type === 'layer') return false;
      if (item.type === 'layer' && type === 'layer') return false;
      if (item.type === 'folder' && item.id === id) return false;
      return true;
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop: (dragItem, monitor) => {
      if (!monitor.didDrop()) {
        onStartDrag?.(null);
        setSelectedLayersItem(dragItem as any);
        setDropFolder({ id, name, type });
        setIsConfirmModalOpen(true);
      }
    },
  });

  useEffect(() => {
    onStartDrag?.(null);
  }, [isOver, onStartDrag]);

  const getBackgroundColor = () => {
    if (isOver && !canDrop) return alpha(theme.palette.error.main, 0.5);
    if (isOver && canDrop) return alpha(theme.palette.success.main, 0.5);
    return 'transparent';
  };

  return (
    <SC.LayersListItemStyled
      onDoubleClick={() => {
        if (type === 'folder') onFolderDoubleClick?.(listItem);
      }}
      ref={(node: any) => {
        dragRef(node);
        dropRef(node);
      }}
      sx={{
        backgroundColor: getBackgroundColor(),
        transition: 'background-color 0.3s',
      }}
    >
      {type === 'layer' && (
        <Checkbox
          checked={listItem.checked}
          onChange={(e) => handleCheckLayerChange?.(e.target.checked, id)}
        />
      )}
      <ListItemIcon sx={{ minWidth: 0, marginRight: '3px' }}>{icon}</ListItemIcon>
      <ListItemText>{name}</ListItemText>

      <SC.LayersButtonsWrapper className="action-buttons">
        <IconButton
          onClick={() => onClick?.(listItem, 'edit')}
          // data-testid=
          // disabled={!(permissions?.update ?? true)}
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => onClick?.(listItem, 'delete')}
          // data-testid=
          // disabled={!(permissions?.update ?? true)}
        >
          <Delete fontSize="small" />
        </IconButton>
      </SC.LayersButtonsWrapper>
    </SC.LayersListItemStyled>
  );
};
