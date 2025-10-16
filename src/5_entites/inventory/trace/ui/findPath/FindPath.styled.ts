import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const FindPathStyled = styled(Box)`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const Body = styled(Box)`
  width: 100%;
  height: 25%;
  display: flex;
  gap: 20px;
`;

export const Footer = styled(Box)`
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const LeftSide = styled(Box)`
  width: 50%;
`;

export const RightSide = styled(Box)`
  width: 50%;
`;

export const TextWrapper = styled(Box)`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  border-radius: 10px;
  height: 37px;
`;

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
