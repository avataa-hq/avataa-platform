import styled from '@emotion/styled';
import { Box } from '@mui/system';

export const AuditPageContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  background-color: ${({ theme }) => theme.palette.neutral.surface};
`;

export const MainViewContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1.25rem;
  position: relative;
`;

// export const AuditPageStyled = styled(Box)`
//   position: relative;
//   width: 100%;
//   height: 100%;
// `;

// export const LoadingContainer = styled(Box)`
//   z-index: 2;
//   position: absolute;
//   top: 50%;
//   right: 50%;
//   transform: translate(50%, -50%);
// `;

// export const AuditPageContainer = styled(Box)`
//   display: flex;
//   flex-direction: column;
//   height: 100%;
// `;

// export const AuditPageHeader = styled(Box)`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 20px;
//   padding: 20px;
// `;

// export const DateContainer = styled(Box)`
//   display: flex;
//   gap: 10px;
// `;
