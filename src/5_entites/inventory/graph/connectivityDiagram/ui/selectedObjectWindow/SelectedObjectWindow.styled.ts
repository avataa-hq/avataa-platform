import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const ObjectWindowBackdrop = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  pointer-events: none;
`;

export const SelectedObjectWindowStyled = styled(Box)`
  width: 400px;
  height: 500px;
  border-radius: 5px;
  background: ${({ theme }) => theme.palette.background.default};
  box-shadow: 8px 20px 17px -9px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50px;
  left: 20px;
  pointer-events: all;
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;

export const Header = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

export const Body = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

export const ListItem = styled(Box)`
  display: flex;
  align-items: center;
  padding: 15px;
  box-shadow: -2px 4px 5px -4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  user-select: none;

  &:hover {
    scale: 102%;
  }
`;
