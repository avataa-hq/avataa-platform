import styled from '@emotion/styled';
import Box from '@mui/material/Box';

export const MultiFilterComponentStyled = styled(Box)`
  width: 100%;
  //max-width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const Header = styled(Box)`
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
`;
export const Body = styled(Box)`
  width: 100%;
  height: 90%;
  //padding: 0 0 15px 0;
  display: flex;
  flex-direction: column;
  gap: 2%;
`;
export const BodyHeader = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;
export const BodyContent = styled(Box)`
  width: 100%;
  overflow-y: auto;
  padding: 10px 0;
`;
export const BodyFooter = styled(Box)`
  width: 100%;
`;
