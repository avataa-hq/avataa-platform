import { FolderOpen, KeyboardArrowDown } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import { HierarchyObject } from '6_shared/api/hierarchy/types';
import { useRef, useState } from 'react';

import { InventoryObjectTypesModel } from '6_shared';
import { TreeItemStyled, ItemTextStyled } from '../../treeItem/TreeItem.styled';

type Item = HierarchyObject | InventoryObjectTypesModel;

type IProps<T extends Item> = {
  item: T;
  onParentClick: (parent: T) => void;
  ml: number;
  getParentRightSideElements?: (item: T) => React.ReactNode;
};

export const ParentsItem = <T extends Item>({
  item,
  onParentClick,
  ml,
  getParentRightSideElements,
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

  return (
    <Tooltip title={name} placement="right" open={isTooltipVisible}>
      <TreeItemStyled
        onClick={() => onParentClick(item)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ml={ml}
      >
        <KeyboardArrowDown />
        <FolderOpen />
        <ItemTextStyled ref={textRef}>{name}</ItemTextStyled>

        {getParentRightSideElements && name !== 'Root' && getParentRightSideElements(item)}
      </TreeItemStyled>
    </Tooltip>
  );
};
