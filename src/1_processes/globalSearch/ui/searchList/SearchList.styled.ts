import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';

interface ISearchListStyledProps extends BoxProps {
  state: 'expanded' | 'collapsed';
}

export const SearchListStyled = styled(Box)<ISearchListStyledProps>`
  position: absolute;
  top: 40px;
  z-index: 1234;
  width: 100%;
  min-height: 120px;

  max-height: 700px;
  border-radius: 10px;
  background: ${({ theme }) => theme.palette.background.default};
  box-shadow: -8px 7px 10px -6px #00000030;

  display: flex;
  flex-direction: column;
  opacity: ${({ state }) => (state === 'collapsed' ? '0' : '1')};

  transition: opacity 0.3s;
  overflow: hidden;

  & .gs_highlight {
    background-color: rgba(255, 255, 0, 0.34);
    font-weight: bold;
  }
`;

export const Header = styled(Box)`
  position: absolute;
  top: 0%;
  right: 50%;
  transform: translate(50%, 100%);
  white-space: nowrap;
  padding: 10px;
`;

export const Body = styled(Box)`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 500px;
  padding: 10px;
`;

interface IListItemProps extends BoxProps {
  active?: 'true' | 'false';
}

export const ListItem = styled(Box)<IListItemProps>`
  flex-direction: column;
  display: flex;
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  /* box-shadow: ${({ active }) =>
    active === 'true' ? '1px 20px 10px -15px #00000052' : '2px 8px 17px -15px #00000030'}; */
  color: ${({ theme, active }) =>
    active === 'true' ? theme.palette.primary.contrastText : 'inherit'};
  cursor: pointer;
  background: ${({ theme, active }) =>
    active === 'true' ? theme.palette.primary.main : 'transparent'};
  transition: all 0.3s;
`;

export const Footer = styled(Box)``;

export const LoadingContainer = styled.div`
  z-index: 50;
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  align-items: center;
  opacity: 0.7;
`;
