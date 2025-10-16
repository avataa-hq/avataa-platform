import styled from '@emotion/styled';
import { alpha, Box, BoxProps } from '@mui/material';

interface ItemContainerStyledProps extends BoxProps {
  ml?: number;
  isselected?: 'true' | 'false';
}

export const TreeItemStyled = styled(Box)<ItemContainerStyledProps>`
  display: flex;
  align-items: center;
  padding: 0 20px;
  opacity: 0;
  gap: 0.5rem;
  cursor: pointer;
  margin-left: ${({ ml }) => `${ml}px`};
  width: ${({ ml }) => (ml ? `calc(100% - ${ml}px)` : '100%')};
  background: ${({ isselected, theme }) =>
    isselected === 'true' && alpha(theme.palette.primary.main, 0.5)};
  transition: all 0.3s;
  animation: hierarchy_item 1s forwards;

  box-shadow: ${({ isselected }) =>
    isselected === 'true' ? '-10px 10px 10px -10px rgba(0, 0, 0, 0.4)' : 'none'};

  @keyframes hierarchy_item {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 100;
    }
  }

  &:hover {
    box-shadow: -10px 10px 10px -10px rgba(0, 0, 0, 0.4);
  }

  &:hover .objects-actions {
    animation: hierarchy_item 1s forwards;
    opacity: 1;
    visibility: visible;
  }
`;

interface ItemTextStyledProps extends BoxProps {
  isselected?: 'true' | 'false';
}

export const ItemTextStyled = styled(Box)<ItemTextStyledProps>`
  flex: 1;
  white-space: nowrap;
  height: 30px;
  font-weight: 800;
  font-size: 17px;
  line-height: 30px;
  letter-spacing: 0.2px;
  user-select: none;
  transition: all 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
`;
