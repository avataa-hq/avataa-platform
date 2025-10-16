import styled from '@emotion/styled';
import { MenuList, MenuItem, Button, Box, css } from '@mui/material';

interface NestedElementProps {
  disabled?: boolean;
}

export const NestedMenu = styled(MenuList)`
  .nested_child {
    display: flex;
    flex-direction: column;
    transition: all 0.5s;
    min-width: 200px;
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

export const TopLevelMenuItem = styled(MenuItem)`
  border-bottom: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
`;

export const NestedElement = styled(Box)<NestedElementProps>`
  padding: 6px 16px;
  &:hover {
    transition: all 0.3s;
    background: ${({ theme }) => theme.palette.action.hover};
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;
