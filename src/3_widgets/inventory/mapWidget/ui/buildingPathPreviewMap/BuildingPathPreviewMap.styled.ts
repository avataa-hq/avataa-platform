import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const BuildingPathPreviewMapStyled = styled(Box)`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.background.default};
  border-radius: 10px;
`;

export const Body = styled(Box)`
  width: 900px;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Footer = styled(Box)`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  padding: 10px;
`;

export const FooterPathPointsContainer = styled(Box)`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  height: 50px;
`;

export const FooterPathPoint = styled(Box)`
  width: 10px;
  border-radius: 10px;
  background: ${({ theme }) => theme.palette.primary.main};

  transition: all 0.2s ease-in-out;
`;

export const FooterText = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

export const FooterActions = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px;
`;
