import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const DataAuditHeaderStyled = styled(Box)`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 5px;
`;

export const Top = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 10px;
`;

export const TopLeft = styled(Box)`
  min-width: fit-content;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.625rem;
  & * h1 {
    margin-right: 20px;
  }
`;

export const Bottom = styled(Box)`
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
`;
