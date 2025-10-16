import styled from '@emotion/styled';
import { Handle, ReactFlow } from '@xyflow/react';
import { ASSOCIATED_OBJECTS_NODE_HEIGHT, ASSOCIATED_OBJECTS_NODE_WIDTH, Box } from '6_shared';
import { Typography } from '@mui/material';

export const ChildrenFlowchartStyled = styled(ReactFlow)`
  width: 100%;
`;

export const TreeDataNodeContainer = styled(Box)`
  width: ${ASSOCIATED_OBJECTS_NODE_WIDTH}px;
  height: ${ASSOCIATED_OBJECTS_NODE_HEIGHT}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  position: relative;
  z-index: 10000;
`;

export const TreeDataNodeCircleContainer = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  z-index: 10000;
`;

export const TreeDataNodeCircle = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: 20px;
  z-index: 10001;
`;

export const TreeDataNodeBoxLabel = styled(Typography)`
  max-width: 85%;
  max-height: 100%;
  overflow: hidden;
  text-align: center;
`;

export const TreeDataNodeBox = styled(Box)`
  width: ${ASSOCIATED_OBJECTS_NODE_WIDTH}px;
  height: 45px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  z-index: 10001;
`;

export const HandleStyled = styled(Handle)`
  width: 5px;
  height: 5px;
  background-color: ${({ theme }) => theme.palette.info.main};
  border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  opacity: 0;
  position: absolute;
`;
