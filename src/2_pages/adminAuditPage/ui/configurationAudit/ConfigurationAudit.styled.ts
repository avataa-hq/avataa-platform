import styled from '@emotion/styled';
import { Box } from '@mui/system';

export const ConfigurationAuditStyled = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const LoadingContainer = styled(Box)`
  z-index: 2;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
`;

export const ConfigurationAuditContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ConfigurationAuditHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
`;
