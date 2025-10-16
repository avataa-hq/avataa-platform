import styled from '@emotion/styled';
import { alpha, Box, BoxProps } from '@mui/material';

interface FilterSetListItemStyledProps extends BoxProps {
  selected?: boolean;
}

export const FilterSetListItemStyled = styled(Box)<FilterSetListItemStyledProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 5px;
  flex-wrap: wrap;
  align-items: center;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 10px;

  background: ${({ theme, selected }) =>
    selected === true ? alpha(theme.palette.primary.main, 1) : 'transparent'};
  box-shadow: ${({ selected }) =>
    selected === true
      ? '0 10px 15px -8px rgba(0, 0, 0, 0.5)'
      : '-5px 4px 7px -8px rgba(0, 0, 0, 0.5)'};

  transition: all 0.3s;
  color: ${({ theme, selected }) =>
    selected === true ? theme.palette.primary.contrastText : theme.palette.text.primary};

  &:hover {
    box-shadow: 0 10px 15px -8px rgba(0, 0, 0, 0.5);
  }
`;

export const HiddenButtonContainer = styled(Box)``;

export const Left = styled(Box)`
  display: flex;
  align-items: center;
`;
export const Center = styled(Box)`
  display: flex;
  flex: 1;
`;
export const Right = styled(Box)<FilterSetListItemStyledProps>`
  display: flex;
  color: ${({ theme, selected }) =>
    selected === true ? theme.palette.primary.contrastText : theme.palette.text.primary};
`;
