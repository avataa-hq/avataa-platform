import styled from '@emotion/styled';
import { Box, Paper } from '@mui/material';

export const DetailsPageStyled = styled(Box)`
  display: flex;
  width: 100%;
  height: 95%;
`;

export const TopContainer = styled(Box)`
  width: 100%;
  height: 50%;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  border-radius: 10px;
  overflow: hidden;
`;

export const TopContainerHead = styled(Box)`
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 10px -10px ${(props) => props.theme.palette.neutralVariant.outline};
  overflow-x: auto;
  overflow-y: hidden;
`;

export const TopContainerBody = styled(Box)`
  display: flex;
  width: 100%;
  height: 60%;
`;

export const TopContainerBodyLeft = styled(Box)`
  padding: 1% 2%;
  height: 100%;
  box-shadow: 10px 0 10px -10px ${(props) => props.theme.palette.neutralVariant.outline};
  width: 30%;
`;

export const TopContainerBodyRight = styled(Box)`
  padding: 1% 2%;
  height: 100%;
  width: 70%;
  box-shadow: -10px 0 10px -10px ${(props) => props.theme.palette.neutralVariant.outline};
  overflow: hidden;
`;

export const BottomContainer = styled(Paper)`
  width: 100%;
  height: 50%;
`;

export const BottomContainerHead = styled(Box)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 10%;
  padding: 0 10px;
`;

export const BottomContainerBody = styled(Box)`
  width: 100%;
  overflow: auto;
`;
