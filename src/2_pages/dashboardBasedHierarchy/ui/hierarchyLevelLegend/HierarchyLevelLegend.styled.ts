import styled from '@emotion/styled';
import { AccordionSummary, Box } from '@mui/material';

export const HierarchyLevelLegendStyled = styled(Box)`
  background: ${({ theme }) => theme.palette.background.default};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;

export const Header = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
`;

export const LegendItem = styled(AccordionSummary)`
  box-shadow: -1px 19px 15px -10px rgba(0, 0, 0, 0.05);

  &.Mui-expanded {
    height: 40px;
  }

  & .MuiAccordionSummary-content {
    min-width: 200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export const LegendChildItem = styled(Box)`
  display: flex;
  align-items: center;
  min-width: 150px;
  gap: 10px;
  padding: 10px;
`;
