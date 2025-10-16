import React, { ReactElement, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const CustomMenuStyled = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: theme.palette.text.primary,
    maxWidth: '25rem',
    fontSize: theme.typography.pxToRem(12),
    border: 'none',
    borderRadius: '10px',
    background: theme.palette.background.default,
    zIndex: 999,
    boxShadow: `0px 4px 20px 0px ${theme.palette.neutral.backdrop}`,
  },
}));

const placementOptions = [
  'bottom',
  'left',
  'right',
  'top',
  'bottom-end',
  'bottom-start',
  'left-end',
  'left-start',
  'right-end',
  'right-start',
  'top-end',
  'top-start',
] as const;

type Placement = (typeof placementOptions)[number];

interface TooltipWithActionsProps {
  content?: ReactNode;
  children: ReactElement;
  open: boolean;
  placement?: Placement;
  setOpen?: (isOpen: boolean) => void;
}

export const CustomMenu: React.FC<TooltipWithActionsProps> = ({
  content,
  children,
  open,
  placement = 'bottom',
  setOpen,
}) => {
  return (
    <CustomMenuStyled
      open={open}
      placement={placement}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      title={<div>{content}</div>}
    >
      {children}
    </CustomMenuStyled>
  );
};
