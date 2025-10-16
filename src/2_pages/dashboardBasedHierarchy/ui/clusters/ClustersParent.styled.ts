import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const Header = styled(Box)`
  min-height: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1%;
  width: 100%;
  height: 15%;
`;
export const Body = styled(Box)`
  display: flex;
  //justify-content: center;
  padding: 10px;
  gap: 2%;
  width: 100%;
  height: 85%;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    height: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme: { palette } }) => palette.primary.main};
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: ${({ theme: { palette } }) => palette.neutralVariant.outline};
  }
`;
