import styled from '@emotion/styled';
import { Box } from '6_shared';

export const IncomingLinkObjectNodeStyled = styled(Box)`
  padding: 5px 5px 5px 10px;
  border-radius: 5px;
  width: 210px;
  height: 30px;
  background-color: ${({ theme }) => theme.palette.components.reactFlow.nodeBackgroundStandard};
  box-shadow: ${({ theme }) => `-8px 7px 10px -6px ${theme.palette.secondary.main}`};
  color: ${({ theme }) => theme.palette.components.map.iconColor3};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const IncomingLinkParamTypeNodeStyled = styled(Box)`
  padding: 5px 5px 5px 10px;
  border-radius: 5px;
  width: 210px;
  height: 30px;
  background-color: ${({ theme }) => theme.palette.components.reactFlow.nodeBackgroundSecondary};
  color: ${({ theme }) => theme.palette.info.main};
  box-shadow: ${({ theme }) => `-8px 7px 10px -6px ${theme.palette.secondary.main}`};
  color: ${({ theme }) => theme.palette.components.map.iconColor3};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ConnectorObjectNodeStyled = styled(Box)`
  padding: 10px 5px 5px 5px;
  border-radius: 5px;
  position: relative;
  width: 300px;
  height: 55px;
  background-color: ${({ theme }) => theme.palette.components.reactFlow.nodeBackgroundMain};
  box-shadow: ${({ theme }) => `-8px 7px 10px -6px ${theme.palette.secondary.main}`};
  color: ${({ theme }) => theme.palette.components.map.iconColor3};
`;
