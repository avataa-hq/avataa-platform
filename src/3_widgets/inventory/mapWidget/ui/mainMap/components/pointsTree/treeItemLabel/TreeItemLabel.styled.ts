import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const TreeItemLabelStyled = styled(Box)`
  height: 100%;
  min-height: 37px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-radius: 10px;
  padding: 5px;
`;
export const ItemLeft = styled(Box)`
  height: 100%;
  max-width: 30%;
  justify-content: center;
  align-items: center;
`;
export const ItemRight = styled(Box)`
  height: 100%;
  max-width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
  text-align: left;
`;
