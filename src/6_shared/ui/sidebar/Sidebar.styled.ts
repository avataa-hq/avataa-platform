import { CSSObject, styled, Theme } from '@mui/material';
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer';

const openedMixin = (theme: Theme, width: number): CSSObject => ({
  color: theme.palette.components.sidebar.text,
  width,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  color: theme.palette.components.sidebar.text,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: 57,
  overflowX: 'hidden',
});

export const SidebarContainer = styled('div')`
  display: flex;
  width: 100%;
  height: 100%;
  label: SidebarContainer;
`;

interface IDrawerStyledProps extends DrawerProps {
  width: number;
}

export const SidebarStyled = styled(MuiDrawer)<IDrawerStyledProps>`
  width: ${({ width }) => `${width}px`};
  flex-shrink: 0;
  white-space: nowrap;
  box-sizing: border-box;

  & .MuiPaper-root {
    background: ${({ theme }) => theme.palette.components.sidebar.background};
    backdrop-filter: blur(50px);
    color: ${({ theme }) => theme.palette.components.sidebar.text};
    padding: 20px 0;
  }

  & .MuiSvgIcon-root {
    color: inherit;
  }

  ${({ open, theme, width }) => ({
    ...(open && {
      ...openedMixin(theme, width),
      '& .MuiDrawer-paper': openedMixin(theme, width),
    }),
  })} ${({ open, theme }) => ({
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })}
`;

export const SidebarContent = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1%;
  flex: 1;
  max-height: 100%;
  position: relative;
`;

export const SidebarHeader = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`;

export const SidebarBody = styled('div')`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;

  border-bottom: 1px solid ${({ theme }) => theme.palette.components.sidebar.outline};

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.palette.primary.main};
    border-radius: 10px;
  }
`;
export const SidebarFooter = styled('div')`
  margin-top: auto;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const SidebarFooterSwitchButton = styled('div')`
  position: relative;
  display: flex;
  width: 100%;
  height: 40px;

  .icon-button {
    position: absolute;
    right: 10px;
    top: 10px;

    &:focus {
      outline: none;
    }
  }
`;

export const ContentContainer = styled('main')`
  flex: 1;
  overflow: hidden;
`;
