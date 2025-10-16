import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const StepByStepCreationComponentStyled = styled(Box)`
  width: 100%;
  max-width: 700px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TitleContainer = styled(Box)`
  padding: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Header = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
`;
export const Body = styled(Box)`
  flex: 1;
  border-bottom: 2px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  min-height: 200px;
  width: 100%;
`;

export const Footer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;
