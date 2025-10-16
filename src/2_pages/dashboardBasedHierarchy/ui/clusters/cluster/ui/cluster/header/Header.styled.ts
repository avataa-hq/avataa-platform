import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { Box } from '6_shared';

export const HeaderStyled = styled(Box)`
  width: 100%;
  height: 10%;
  display: flex;
  z-index: 2;
`;

export const Title = styled(Typography)`
  align-self: center;
  width: 100%;
  height: 100%;
  line-height: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
