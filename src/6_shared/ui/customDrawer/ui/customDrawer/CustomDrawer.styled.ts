import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const CustomDrawerContent = styled(Box)`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const LeftContent = styled(Box)`
  width: 40px;
  height: 100%;
`;

export const RightContent = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: calc(100% - 40px);
  height: 100%;
`;

export const RightContentHeader = styled(Box)`
  width: 100%;
  /* height: 6%; */
  height: 42px;
  padding: 5px 10px 5px 20px;
`;

export const RightContentBody = styled(Box)`
  width: 100%;
  /* height: 88%; */
  padding: 0px 10px 5px 20px;
  flex: 1;
  overflow-y: auto;
`;

export const RightContentFooter = styled(Box)`
  width: 100%;
  /* height: 5%; */
  height: 48px;
`;

export const Dragger = styled(Box)`
  cursor: ew-resize;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 5px;
  z-index: 100;
  background-color: '#f4f7f9';
`;
