import { useRef, useState } from 'react';
import { FolderOpen, InsertDriveFile, StarRateRounded, Edit, Delete } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { HierarchyObject } from '6_shared/api/hierarchy/types';
import { ActionTypes, Box, InventoryObjectTypesModel } from '6_shared';
import { ItemTextStyled, TreeItemStyled } from '../../treeItem/TreeItem.styled';

type Item = HierarchyObject | InventoryObjectTypesModel;

interface IProps<T extends Item> {
  item: T;
  selectedChildren?: number | null | string;
  getChildRightSideElements?: (item: T) => React.ReactNode;
  getChildLeftSideElements?: (item: T) => React.ReactNode;
  onChildrenClick: (event: React.MouseEvent<HTMLElement>, item: T) => void;
  onEditClick?: (item: InventoryObjectTypesModel) => void;
  onDeleteClick?: () => void;
  handleClickContextMenu?: (event: any, item: T) => void;
  itemId: string | number;
  showChildrenCount?: boolean;
  showSeverity?: boolean;
  onFavoriteClick?: (id: number) => void;
  favorite?: boolean;
  showFavorite?: boolean;
  isObjectSettings?: boolean;
  permissions?: Record<ActionTypes, boolean>;
}

export const ChildrenItem = <T extends Item>({
  item,
  selectedChildren,
  getChildRightSideElements,
  getChildLeftSideElements,
  onChildrenClick,
  onEditClick,
  onDeleteClick,
  handleClickContextMenu,
  itemId,
  showChildrenCount = true,
  showSeverity,
  onFavoriteClick,
  favorite,
  showFavorite,
  isObjectSettings = false,
  permissions,
}: IProps<T>) => {
  const textRef = useRef<HTMLDivElement | null>(null);

  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const handleMouseEnter = () => {
    if (textRef.current) {
      const isTextTruncated = textRef.current.scrollWidth > textRef.current.clientWidth;
      setTooltipVisible(isTextTruncated);
    }
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };
  const name =
    'key' in item ? (item as HierarchyObject).key : (item as InventoryObjectTypesModel).name;
  const { id } = item;

  const renderIcon =
    item.child_count && item.child_count > 0 ? <FolderOpen /> : <InsertDriveFile />;

  const isInventoryObject = (newItem: Item): newItem is InventoryObjectTypesModel => {
    return 'name' in newItem;
  };

  return (
    <Tooltip
      title={item.child_count !== 0 && 'key' in item ? `${name} (${item.child_count})` : name}
      placement="right"
      open={isTooltipVisible}
    >
      <TreeItemStyled
        id={itemId.toString()}
        onContextMenu={(event) => handleClickContextMenu?.(event, item)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        isselected={id === selectedChildren ? 'true' : 'false'}
      >
        {getChildLeftSideElements && getChildLeftSideElements(item)}
        {renderIcon}
        {showChildrenCount && (
          <ItemTextStyled
            onClick={(event) => onChildrenClick(event, item)}
            isselected={id === selectedChildren ? 'true' : 'false'}
          >
            {item.child_count !== 0 && 'key' in item ? `${name} (${item.child_count})` : name}
          </ItemTextStyled>
        )}
        {!showChildrenCount && (
          <ItemTextStyled
            onClick={(event) => onChildrenClick(event, item)}
            isselected={id === selectedChildren ? 'true' : 'false'}
          >
            {item.child_count !== 0 && 'key' in item ? `${name}` : name}
          </ItemTextStyled>
        )}
        {getChildRightSideElements && getChildRightSideElements(item)}
        {showFavorite && (
          <IconButton
            onClick={() => onFavoriteClick?.(+item.id)}
            data-testid={`Left-panel__${name}-objType__favourite-toggle`}
          >
            <StarRateRounded
              sx={{
                fill: favorite ? 'yellow' : 'current',
              }}
            />
          </IconButton>
        )}
        {isObjectSettings && isInventoryObject(item) && (
          <Box className="objects-actions" sx={{ opacity: 0, visibility: 'hidden' }}>
            <IconButton
              onClick={() => onEditClick?.(item)}
              size="small"
              data-testid={item.name?.startsWith('at_') ? `${item.name}_edit-btn` : undefined}
              disabled={!(permissions?.update ?? true)}
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={onDeleteClick}
              size="small"
              data-testid={item.name?.startsWith('at_') ? `${item.name}_delete-btn` : undefined}
              disabled={!(permissions?.update ?? true)}
            >
              <Delete />
            </IconButton>
          </Box>
        )}
      </TreeItemStyled>
    </Tooltip>
  );
};
