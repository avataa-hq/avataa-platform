import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const SessionAuditStyled = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const SessionAuditContainer = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 1.25rem;
`;

// export const SessionAuditHeader = styled(Box)`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 20px;
//   padding: 20px;
//   height: 10%;
// `;

export const SessionAuditBody = styled(Box)`
  width: 100%;
  height: 90%;
`;
