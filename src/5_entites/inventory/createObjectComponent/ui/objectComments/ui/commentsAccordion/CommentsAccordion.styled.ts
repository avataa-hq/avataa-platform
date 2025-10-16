import styled from '@emotion/styled';
import { Accordion, Typography } from '@mui/material';
import { Box } from '6_shared';

export const CommentsAccordionStyled = styled(Box)`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-right: 20px;

  &::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 50px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: ${({ theme }) => theme.palette.components.scrollBar.thumbBackground};
  }
`;

export const AccordionStyled = styled(Accordion)`
  background: ${(props) => props.theme.palette.neutral.surface};
`;

export const CommentsAccordionContent = styled(Box)`
  display: flex;
  gap: 15px;
`;

export const CommentsDate = styled(Typography)`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  opacity: 0.3;
  padding: 3px 0;
`;

export const CommentsTextSmall = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 250px;
  height: 20px;
`;
