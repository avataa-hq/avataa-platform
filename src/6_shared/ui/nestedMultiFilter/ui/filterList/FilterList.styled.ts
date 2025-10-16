import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const FilterListStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
export const Header = styled(Box)`
  width: 80%;
  //height: 15%;
  padding: 5px 0;
  display: flex;
  justify-content: center;
  gap: 20%;
`;
export const Body = styled(Box)`
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  align-items: center;
  gap: 10px;
`;
