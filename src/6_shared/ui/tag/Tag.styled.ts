import isPropValid from '@emotion/is-prop-valid';
import styled from '@emotion/styled';
import { alpha, Box, Theme } from '@mui/material';

import { ThemeColors } from '6_shared/types';
import { BoxOwnProps } from '@mui/system';

interface TabContainerProps {
  color: ThemeColors;
  selected: boolean;
  clickable: boolean;
}

export const TagContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    isPropValid(prop) && prop !== 'color' && prop !== 'selected' && prop !== 'clickable',
})<BoxOwnProps<Theme> & TabContainerProps>`
  display: inline;
  color: ${({ color, selected, theme }) =>
    selected ? theme.palette.text.primary : theme.palette[color as ThemeColors].main};
  background-color: ${({ color, selected, theme }) =>
    selected
      ? theme.palette[color as ThemeColors].main
      : alpha(theme.palette[color as ThemeColors].main, 0.1)};
  border-radius: 0.625rem;
  padding: 5px 10px;
  transition: all 0.3s;

  &:hover {
    ${({ color, clickable, theme }) =>
      clickable &&
      `box-shadow: 0 2px 4px ${alpha(theme.palette[color as ThemeColors].main, 0.3)}};`}
  }
`;
