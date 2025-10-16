import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const LegendContentStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const LegendBodyContent = styled(Box)`
  width: 100%;
`;

export const AccordionSummaryContent = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

export const AccordionDetailsContent = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`;

export const AccordionDetailsContentWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 80%;
`;

export const IconWrapper = styled(Box)`
  min-width: 85px;
  width: 40%;
  max-width: 95px;
  padding: 5px;
  border-radius: 5px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.neutralVariant.outline};
`;

export const LineWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 95px;
  border-radius: 5px;
  padding: 5px 10px;
  background-color: ${({ theme }) => theme.palette.neutralVariant.outline};
`;
