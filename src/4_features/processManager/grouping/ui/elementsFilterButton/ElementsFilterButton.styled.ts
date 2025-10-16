import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const ElementsFilterButtonStyled = styled(Box)`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  gap: 5px;
  cursor: pointer;
  opacity: 0.7;

  border-radius: 20px;
  box-shadow: -5px 4px 7px -8px rgba(0, 0, 0, 0.5);

  transition: all 0.1s;

  &:hover {
    opacity: 1;
    box-shadow: 0 10px 15px -8px rgba(0, 0, 0, 0.2);
  }
  &:active {
    scale: 99%;
    box-shadow: inset 0 10px 15px -8px rgba(0, 0, 0, 0.2);
  }
`;
