import styled from '@emotion/styled';
import { Typography, Box } from '@mui/material';

export const InformationStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Header = styled(Box)`
  display: flex;
  align-items: center;
  height: 10%;
  width: 100%;
`;
export const Body = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 90%;
  width: 100%;
  overflow: auto;
`;

export const Row = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const Item = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ItemText = styled(Typography)`
  white-space: nowrap;
  text-transform: capitalize;
`;

export const BandsText = styled(Typography)`
  margin-right: 4%;
  font-weight: bold;
  white-space: nowrap;
`;
