import styled from '@emotion/styled';
import { Box, ButtonGroup, Slider } from '@mui/material';

export const DiagramsStyled = styled(Box)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const GraphStyled = styled.div`
  width: 100%;
  height: 100%;

  .rd3t-link {
    stroke: ${({ theme }) => theme.palette.primary.light};
  }

  .hierarchy-builder-diagram-svg {
    overflow: visible;
    z-index: 1;
  }

  .g6-component-contextmenu {
    box-shadow: ${({ theme }) => theme.shadows[10]};
    padding: 0;
    border-width: 0;
    border-radius: 10px;
    overflow: hidden;
    background-color: ${({ theme }) => theme.palette.background.default};
    z-index: 10;

    .config-graph__context-menu {
      padding: 0;
      user-select: none;
      list-style: none;
      margin: 0;

      .config-graph__context-menu__row:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
      }

      .config-graph__context-menu__row {
        padding: 5px 20px;
        font-size: 14px;
        font-weight: 400;
        font-family: ${({ theme }) => theme.typography.fontFamily};
        cursor: pointer;
        color: ${({ theme }) => theme.palette.text.disabled};

        &.enabled {
          color: ${({ theme }) => theme.palette.text.primary};
          transition: color 0.3s, background-color 0.3s;

          &:hover {
            background-color: ${({ theme }) => theme.palette.action.hover};
          }
        }
      }
    }
  }
`;

export const SearchContainer = styled(Box)`
  position: absolute;
  top: 20px;
  /* right: 20px; */
  box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  background-color: ${({ theme }) => theme.palette.background.default};
  transition: 0.2s;
`;

export const ZoomButtons = styled(ButtonGroup)`
  border-radius: 10px;
  background-color: ${({ theme }) => theme.palette.background.default};
  overflow: hidden;

  .MuiButton-root {
    border-width: 0;
    border-radius: 0;
    min-width: 0;
    padding: 5px;
  }

  .MuiButton-root:hover {
    transform: unset;
  }
`;

export const ZoomSlider = styled(Slider)`
  height: 200px;
  margin-left: 34px;
  margin-right: 0;

  .MuiSlider-markLabel {
    left: -26px;
  }
`;
