import { Dispatch, SetStateAction, ReactNode } from 'react';
import styled from '@emotion/styled';
import {
  ClickAwayListener,
  Fade,
  Paper,
  MenuItem,
  MenuList,
  Popper,
  PaperProps,
  MenuItemProps,
  PopperPlacementType,
} from '@mui/material';

import { useTranslate } from '6_shared';

const PaperStyled = styled(Paper)`
  width: 100%;
  border-radius: 10px;
  height: 100%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 3px;
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
  }
`;

type ContextMenuItem = string | { title: string; disabled?: boolean; props?: MenuItemProps };

interface IProps {
  isOpen: boolean;
  onClose?: () => void;
  menuItems?: ContextMenuItem[];
  onContextMenuItemClick?: (menuItem: string) => void;
  anchorEl: HTMLElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
  contentComponent?: ReactNode;
  containerSX?: PaperProps['sx'];
  capacityMode?: boolean;
  placement?: PopperPlacementType;
  disablePortal?: boolean;
  selectedItem?: string;
  sx?: any;
}
export const ContextMenu = ({
  isOpen,
  onContextMenuItemClick,
  menuItems,
  onClose,
  anchorEl,
  setAnchorEl,
  contentComponent,
  containerSX,
  capacityMode = false,
  disablePortal = false,
  placement = 'bottom-start',
  selectedItem,
  sx,
}: IProps) => {
  const translate = useTranslate();
  const handleContextMenuItem = (item: string) => {
    onClose?.();
    setAnchorEl(null);
    onContextMenuItemClick?.(item);
  };

  return (
    <Popper
      open={isOpen}
      anchorEl={anchorEl}
      disablePortal={disablePortal}
      transition
      placement={placement}
      sx={{
        ...sx,
        ...(capacityMode ? { height: '50%', overflow: 'hidden' } : { zIndex: 10000 }),
      }}
    >
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={() => onClose?.()}>
          <Fade {...TransitionProps}>
            <PaperStyled sx={containerSX}>
              {contentComponent || (
                <MenuList
                  sx={{
                    '&:focus-visible': {
                      outline: 'none',
                    },
                  }}
                  autoFocus
                >
                  {menuItems?.map((item, idx) => {
                    const menuItem = typeof item === 'string' ? { title: item } : item;
                    return (
                      <MenuItem
                        onClick={() => handleContextMenuItem(menuItem.title)}
                        key={idx}
                        selected={item === selectedItem}
                        disabled={menuItem.disabled ?? false}
                        {...menuItem.props}
                      >
                        {/* @ts-expect-error - The `translate` function has a fallback in case the phrase is not found */}
                        {translate(menuItem.title)}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              )}
            </PaperStyled>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
};
