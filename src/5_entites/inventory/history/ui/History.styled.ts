import styled from '@emotion/styled';
import { Button, Accordion, Typography, alpha } from '@mui/material';
import { Box } from '6_shared';

export const HistoryStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1%;
`;

export const HistoryBody = styled(Box)`
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
  padding-right: 10px;
  flex-grow: 1;

  &::-webkit-scrollbar {
    width: 4px;
    background-color: ${({ theme }) => theme.palette.components.scrollBar.thumbBackground};
  }

  &::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.palette.components.scrollBar.background};
    opacity: 0.2;
    border-radius: 50px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: ${({ theme }) => theme.palette.components.scrollBar.thumbBackground};
  }
`;

export const AccordionContent = styled(Box)`
  width: 100%;
  height: 100%;
`;

export const AccordionDate = styled.span`
  display: block;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  opacity: 0.3;
`;

export const Description = styled(Typography)`
  font-weight: 400;
`;

export const AccordionWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 10px;
  padding-bottom: 0.625rem;
`;

export const DecorContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

export const Line = styled(Box)`
  width: 1px;
  height: 100%;
  background-color: rgba(192, 195, 209, 1);
`;

export const AccordionStyled = styled(Accordion)`
  ::before {
    content: '';
    height: 0;
  }
`;

export const DetailsContent = styled(Box)`
  display: inline-flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 10px;
  padding: 0 10px 20px 0;
`;

export const ParamContent = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  padding: 10px;
  border-radius: 10px;
  min-width: 143px;
`;

export const InfoWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`;

export const ParamName = styled.span`
  color: ${({ theme }) => theme.palette.common.blue};
  font-family: Montserrat;
  font-size: 12px;
  font-weight: 400;
  width: fit-content;
  /* display: inline-block; */

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ExpandButton = styled(Button)`
  min-width: 0;
  width: 90px;
  font-size: 12px;
  color: ${({ theme }) => alpha(theme.palette.text.primary, 0.3)};
  padding: 5px;
  border-radius: 10px;
`;

export const AccordionTitleContent = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`;

export const TitleInfo = styled(Box)`
  width: 37px;
  height: 22px;
  border-radius: 10px;
  background: ${({ theme }) => theme.palette.primary.main};
  padding: 3px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.common.white};
  font-size: 12px;
  font-family: Montserrat;
`;

export const TitleWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* height: 2%; */
`;

export const TitleContent = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const ParamStatus = styled(Typography)`
  font-size: 0.75rem;
  font-weight: 400;
`;

export const HistoryFooter = styled(Box)`
  width: 100%;
  height: 2%;
`;
