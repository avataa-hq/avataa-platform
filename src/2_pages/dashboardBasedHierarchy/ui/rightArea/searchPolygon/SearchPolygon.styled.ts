import styled from '@emotion/styled';
import { Box, BoxProps, IconButton, TextField } from '@mui/material';

interface IGlobalSearchStyledProps extends BoxProps {
  state: 'expanded' | 'collapsed';
}

export const SearchPolygonStyled = styled(Box)<IGlobalSearchStyledProps>`
  width: ${({ state }) => (state === 'collapsed' ? '50px' : '300px')};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;
  transition: width 0.3s;
`;

export const InputContainer = styled(Box)`
  width: 100%;
  position: relative;
`;

export const SearchButton = styled(IconButton)`
  width: 34px;
  height: 34px;
  background-color: ${({ theme: { palette } }) => palette.neutral.surfaceContainerLow};
  backdrop-filter: blur(10px);
  border-radius: 10px;
`;

export const SearchField = styled(TextField)`
  background-color: ${({ theme: { palette } }) => palette.neutral.surfaceContainerLow};
  border-radius: 10px;
`;
