import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const ConfigGraphContainer = styled(Box)`
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
