import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const NestedMultiFilterStyled = styled(Box)`
  width: 100%;
  height: 100%;
  max-width: 800px;
  max-height: 800px;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const Body = styled(Box)`
  width: 100%;
  overflow: hidden;
  //height: 88%;
`;

export const Footer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
`;
