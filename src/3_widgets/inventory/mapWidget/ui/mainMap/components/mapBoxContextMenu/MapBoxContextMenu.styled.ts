import styled from '@emotion/styled';
import { Box, MenuList } from '@mui/material';
import { Popup } from 'react-map-gl';

export const MapBoxContextMenuStyled = styled(Box)`
  background-color: ${({ theme }) => theme.palette.background.default};
  border-radius: 10px;
  padding: 10px;
  box-shadow: 12px 9px 8px 0 rgba(0, 0, 0, 0.29);
  min-width: 155px;
`;

export const MapBoxPopupStyled = styled(Popup)`
  z-index: 10;
  & .mapboxgl-popup-content {
    background: transparent;
    box-shadow: none;
    padding: 0;
  }
`;

export const NestedMenu = styled(MenuList)`
  .nested_child {
    transition: all 0.5s;
    min-width: 150px;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: 20px 13px 17px 2px rgba(0, 0, 0, 0.15);
    background-color: ${({ theme }) => theme.palette.background.default};
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 100%;
    border-left: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
    border-radius: 0 10px 10px 0;
  }

  .parent {
    &:hover {
      > .nested_child {
        transition: all 0.5s;
        visibility: visible;
        opacity: 1;
      }
    }
  }
`;

export const NestedElement = styled(Box)`
  padding: 6px 16px;
  &:hover {
    transition: all 0.3s;
    background: ${({ theme }) => theme.palette.action.hover};
  }
`;
