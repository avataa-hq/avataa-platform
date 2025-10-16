import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';

interface ISearchListStyledProps extends BoxProps {
  state: 'expanded' | 'collapsed';
}

interface IListItemProps extends BoxProps {
  active?: 'true' | 'false';
}

export const SearchPolygonListStyled = styled(Box)<ISearchListStyledProps>`
  z-index: 1234;
  position: absolute;
  top: 40px;
  display: flex;
  flex-direction: column;
  opacity: ${({ state }) => (state === 'collapsed' ? '0' : '1')};
  width: 100%;
  min-height: 80px;
  max-height: 700px;
  border-radius: 10px;
  background: ${({ theme }) => theme.palette.background.default};
  box-shadow: -8px 7px 10px -6px #00000030;
  overflow: hidden;
  transition: opacity 0.3s;

  & .gs_highlight {
    background-color: rgba(255, 255, 0, 0.34);
    font-weight: bold;
  }
`;

export const Header = styled(Box)`
  position: absolute;
  left: 50%;
  top: 50%;
  white-space: nowrap;
  padding: 10px;
  transform: translate(-50%, -50%);
`;

export const Body = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  max-height: 500px;
  overflow-y: auto;
`;

export const ListItem = styled(Box)<IListItemProps>`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  color: ${({ theme, active }) =>
    active === 'true' ? theme.palette.primary.contrastText : 'inherit'};

  cursor: pointer;

  background: ${({ theme, active }) =>
    active === 'true' ? theme.palette.primary.main : 'transparent'};

  transition: all 0.3s;
`;
