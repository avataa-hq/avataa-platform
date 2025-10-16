import { useDrag } from 'react-dnd';
import { MenuItem, MenuItemProps } from '@mui/material';
import { mergeRefs } from '6_shared';
import { forwardRef } from 'react';

interface EtaMenuItemProps extends MenuItemProps {
  dragType?: string;
  dragItem: Record<string, any> | (() => Record<string, any> | null);
}
//     ___
// .__( .)<
// \_____)
// ~~~~~~~
export const EtaMenuItem = forwardRef(
  ({ dragType: type, dragItem: item, children, ...props }: EtaMenuItemProps, ref) => {
    const [, drag] = useDrag(() => ({
      type: 'ETA_NODE',
      item,
    }));

    const itemType = typeof item === 'function' ? item()?.type : item.type;

    return (
      <MenuItem id={`eta-builder_${itemType ?? ''}`} ref={mergeRefs(drag, ref)} {...props}>
        {children}
      </MenuItem>
    );
  },
);
