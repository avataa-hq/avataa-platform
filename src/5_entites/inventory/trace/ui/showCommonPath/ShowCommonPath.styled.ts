import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const ShowCommonPathStyled = styled(Box)`
  width: 100%;
  height: 100%;
`;

export const Body = styled(Box)`
  width: 100%;
  height: 25%;
  display: flex;
  gap: 20px;
`;

export const Footer = styled(Box)`
  width: 100%;
  height: 75%;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
