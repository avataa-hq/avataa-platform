import styled from '@emotion/styled';
import { Box, Card, Paper } from '@mui/material';

export const ObjectDetailsPageContainer = styled(Paper)`
  height: 100%;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const ObjectDetailsPageContent = styled(Box)`
  overflow: hidden;
  display: flex;
  gap: 1.25rem;
  overflow: auto;
  flex: 1;
`;

export const ObjectDetailsCardGrid = styled(Box)`
  flex: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: calc(50% - 0.3125rem);
  gap: 1.25rem;
  align-self: flex-start;
  height: calc(100% - 0.625rem);
`;

export const ObjectDetailsCardContainer = styled(Card)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: none;
  border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};

  .MuiCardHeader-root {
    padding: 0;
  }

  .MuiCardHeader-title {
    font-size: 1rem;
    line-height: 1.25rem;
    font-weight: 600;
  }

  .MuiCardContent-root {
    /* height: 100%; */
    overflow: auto;
    padding: 0;
    flex: 1;
  }

  .MuiCardContent-root:last-child {
    padding-bottom: 0;
  }
`;

export const ObjectTasksContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 100%;
  height: 100%;
`;
