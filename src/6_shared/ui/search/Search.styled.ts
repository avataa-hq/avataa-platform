import styled from '@emotion/styled';
import { InputBase, Paper, IconButton } from '@mui/material';

export const SearchContainer = styled(Paper)`
  padding: 0 4px;
  display: flex;
  align-items: center;
  //width: 240px;
`;

export const SearchInput = styled(InputBase)`
  flex: 1;
  margin-left: 8px;
`;

export const SearchIconButton = styled(IconButton)`
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
`;
