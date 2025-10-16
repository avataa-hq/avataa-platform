import styled from '@emotion/styled';
import {
  Box,
  Button,
  Accordion,
  alpha,
  Typography,
  IconButton,
  AccordionSummary,
} from '@mui/material';
import isPropValid from '@emotion/is-prop-valid';
import { Edit, CheckCircleOutline, HighlightOff } from '@mui/icons-material';

export const AttributesStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 10px;

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

export const AccordionStyled = styled(Accordion)`
  ::before {
    content: '';
    height: 0;
  }
`;

export const AccordionSummaryStyled = styled(AccordionSummary)`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

export const ExpandButton = styled(Button)`
  min-width: 0;
  width: 50px;
  font-size: 12px;
  color: ${({ theme }) => alpha(theme.palette.text.primary, 0.3)};
  padding: 2px 30px;
`;

export const LoadingContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AccordionSummaryContent = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
`;

export const AttributeValue = styled(Typography, {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'expanded' && prop !== 'isLink',
})<{ expanded?: boolean; isLink?: boolean }>(({ expanded, theme, isLink }) => ({
  fontWeight: 400,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
  maxHeight: expanded ? 'none' : '8.5em',
  WebkitLineClamp: expanded ? 'unset' : 5,
  overflowWrap: 'anywhere',

  ...(isLink && {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  }),
}));

export const ButtonsWrapper = styled(Box)`
  display: flex;
  align-items: center;
`;

export const IconButtonStyled = styled(IconButton)`
  width: 32px;
  height: 32px;
  transition: all 250ms linear;
  &:hover,
  &:focus {
    transform: scale(1.1);
  }

  &:hover > svg,
  &:focus > svg {
    fill: ${({ theme }) => alpha(theme.palette.primary.main, 0.4)};
  }

  &:disabled > svg {
    fill: ${({ theme }) => alpha(theme.palette.neutralVariant.icon, 0.4)};
  }
`;

export const ApplyButtonStyled = styled(IconButton)`
  width: 40px;
  height: 40px;
  transition: all 250ms linear;
  & > svg {
    fill: ${({ theme }) => theme.palette.success.main};
  }

  &:disabled > svg {
    fill: ${({ theme }) => theme.palette.text.disabled};
  }
`;

export const EditIconStyled = styled(Edit)`
  width: 1.375rem;
`;

export const ApplyIconStyled = styled(CheckCircleOutline)`
  &.MuiSvgIcon-root {
  }
`;

export const CancelChangesIconStyled = styled(HighlightOff)`
  &.MuiSvgIcon-root {
    color: ${({ theme }) => theme.palette.error.main};
  }
`;
