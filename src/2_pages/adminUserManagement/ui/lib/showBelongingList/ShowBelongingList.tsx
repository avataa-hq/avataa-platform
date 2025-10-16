import { useState } from 'react';
import { Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { getItemName } from '2_pages/adminUserManagement/utilities/utilities';
import { ItemType } from '6_shared';
import { ListItem, ListItemIconButton } from './ShowBelongingList.styled';

interface IProps {
  list?: ItemType[];
  inheritedList?: ItemType[];
  showInherited?: boolean;
  onDeleteClick?: (item: ItemType) => void;
}

export const ShowBelongingList = ({
  list,
  inheritedList,
  showInherited,
  onDeleteClick,
}: IProps) => {
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | string | null>(null);

  if (!list) return null;
  return (
    <>
      {list.map((item: ItemType, index) => (
        <ListItem
          onMouseEnter={() => setHoveredItemIndex(index)}
          onMouseLeave={() => setHoveredItemIndex(null)}
          key={item.id}
        >
          <Typography variant="h3" overflow="hidden">
            {getItemName(item)}
          </Typography>
          <ListItemIconButton
            sx={{
              display: hoveredItemIndex === index ? 'block' : 'none',
            }}
            onClick={() => onDeleteClick?.(item)}
          >
            <Delete />
          </ListItemIconButton>
        </ListItem>
      ))}
      {showInherited &&
        inheritedList?.map((item: ItemType, index: number) => (
          <ListItem
            key={item.id}
            onMouseEnter={() => setHoveredItemIndex(`i${index}`)}
            onMouseLeave={() => setHoveredItemIndex(null)}
          >
            <Typography variant="h3" color="#777" overflow="hidden">
              {getItemName(item)}
            </Typography>
            {/* <Typography
            sx={{
              display: hoveredItemIndex === `i${index}` ? 'block' : 'none',
            }}
            color="#AAA"
            fontWeight="100"
          >
            {translate('Inherited')}
          </Typography> */}
          </ListItem>
        ))}
    </>
  );
};
