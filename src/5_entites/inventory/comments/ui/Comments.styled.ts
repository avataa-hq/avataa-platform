import styled from '@emotion/styled';
import { Button, Accordion, Typography, AccordionSummary, InputBase } from '@mui/material';
import { Box } from '6_shared';

export const CommentsStyled = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;

  @media (max-height: 600px) {
    height: 75%;
  }
`;

export const CommentsBody = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 10px;
  width: 100%;
  /* height: 70%; */
  overflow-y: auto;
  /* padding-right: 10px; */

  &::-webkit-scrollbar {
    width: 4px;
    background-color: ${({ theme }) => theme.palette.components.scrollBar.thumbBackground};
  }

  ::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.palette.components.scrollBar.background};
    opacity: 0.2;
    border-radius: 50px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: ${({ theme }) => theme.palette.components.scrollBar.thumbBackground};
  }
`;

export const CommentsFooter = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  /* height: 10%; */
`;

export const AccordionContent = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const AccordionDate = styled(Typography)`
  display: block;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  opacity: 0.3;
`;

export const AccordionStyled = styled(Accordion)`
  ::before {
    content: '';
    height: 0;
  }
`;

export const ButtonsWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
`;

export const ButtonStyled = styled(Button)`
  min-width: 117px;
`;

export const AccordionSummaryReverse = styled(AccordionSummary)`
  flex-direction: row-reverse;
`;

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FooterWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* max-width: 240px; */
`;
