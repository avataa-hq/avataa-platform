import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const FilterCreationStyled = styled(Box)`
  width: 100%;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  overflow: hidden;
`;

export const Header = styled(Box)`
  width: 100%;
  flex: 1;
  padding: 10px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const HeaderLeftBlock = styled(Box)`
  display: flex;
  align-items: stretch;
  flex-direction: column;
  justify-content: start;
  gap: 5px;

  flex: 2;
`;

export const HeaderRightBlock = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: end;
  flex-direction: column;
  gap: 5px;
  flex: 1;
`;

export const HeaderBlockItem = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BetweenBlock = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
`;

export const Body = styled(Box)`
  width: 100%;
  flex: 11;
  overflow-y: auto;
`;
