import styled from '@emotion/styled';
import { alpha, Box, Button } from '@mui/material';

export const Layout = styled(Box)`
  label: Layout;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .hidden-input {
    opacity: 0;
    height: 0;
    width: 0;
    line-height: 0;
    overflow: hidden;
    padding: 0;
    margin: 0;
  }
`;

export const LayoutContainer = styled(Box)`
  label: LayoutContainer;
  flex: 1;
  overflow: hidden;
`;

export const LayoutSidebar = styled(Box)<{ background?: string; opensize?: number }>`
  label: LayoutSidebar;
  display: flex;
  width: ${({ opensize }) => (opensize ? `${opensize}px` : '295px')};
  height: 100%;
  overflow: visible;
  border-right: 1px solid ${(props) => props.theme.palette.neutral.surfaceContainer};
  background: ${({ background, theme }) =>
    background ?? theme.palette.neutral.surfaceContainerLowest};
  backdrop-filter: blur(50px);
  transition: all 0.3s;
  z-index: 2;

  &.close {
    width: 0;
    transition: all 0.3s;
    overflow: visible;
  }
`;

export const SidebarContainer = styled(Box)`
  label: SidebarContainer;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  width: 100%;
`;

export const SidebarHeader = styled(Box)`
  label: SidebarHeader;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.7rem 1rem 0.7rem;
`;

export const SidebarBody = styled(Box)`
  label: SidebarBody;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  overflow: hidden;
`;

export const SidebarFooter = styled(Box)`
  label: SidebarFooter;
  display: flex;
  /* position: relative; */
  flex-direction: column;
  gap: 0.625rem;
  padding: 0 1.25rem 1.25rem 1.25rem;
  /* bottom: 0; */
`;

export const CollapseButton = styled(Button)`
  position: absolute;
  z-index: 466;
  top: 0;
  right: 0;
  min-width: 0;
  /* min-height: 0; */
  padding: 0;
  width: 15px;
  height: 27px;
  border-radius: 5px 0px 0px 0px;
  transition: all 0.3s;
  background: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};

  &.close {
    transform: scale(-1) translateX(-100%);
    /* right: -30px; */
    transition: all 0.3s;
  }
`;
