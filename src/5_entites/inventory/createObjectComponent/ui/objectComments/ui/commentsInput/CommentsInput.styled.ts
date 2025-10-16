import styled from '@emotion/styled';
import { Box } from '6_shared';
import { Button } from '@mui/material';

export const CommentInputStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export const Body = styled(Box)`
  width: 100%;
`;

export const Footer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 5px;
`;

export const ButtonStyled = styled(Button)`
  height: 37px;
`;
