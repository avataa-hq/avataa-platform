import styled from '@emotion/styled';
import { Box } from '6_shared';
import { Typography } from '@mui/material';

export const LeftAreaStyled = styled(Box)`
  position: relative;
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-width: 382px;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outlineVariant};
  background: ${(props) => props.theme.palette.neutral.surfaceContainerLowest};
  border-radius: 20px;
  overflow: hidden;
`;

export const Header = styled(Box)`
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
`;

export const DataRangeContainer = styled(Box)`
  /* flex: 1; */
  width: 202px;
`;

export const HeaderNameContainer = styled(Box)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
`;

export const HeaderName = styled(Typography)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const SelectContainer = styled(Box)`
  flex: 1;
  max-width: 240px;
`;
