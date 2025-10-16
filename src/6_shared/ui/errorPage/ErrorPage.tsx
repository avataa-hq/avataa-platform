import { Box, IconButton, Typography } from '@mui/material';

import styled from '@emotion/styled';
import { Refresh } from '@mui/icons-material';
import { ErrorData } from '6_shared/types';

const ErrorPageStyled = styled(Box)`
  width: 100%;
  //height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 0.7;
`;

interface IProps {
  error?: ErrorData;
  refreshFn?: () => void;
}

export const ErrorPage = ({ error, refreshFn }: IProps) => {
  if (error) {
    if ('status' in error) {
      const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);
      return (
        <ErrorPageStyled>
          <Typography fontSize="3rem">{error.status}</Typography>
          <Typography variant="body1">{errMsg}</Typography>
          {refreshFn && (
            <IconButton onClick={() => refreshFn()}>
              <Refresh />
            </IconButton>
          )}
        </ErrorPageStyled>
      );
    }
    return (
      <ErrorPageStyled>
        <Typography fontSize="3rem">{error.code ?? '500'}</Typography>
        <Typography variant="body1">{error.message}</Typography>
        {refreshFn && (
          <IconButton onClick={() => refreshFn()}>
            <Refresh />
          </IconButton>
        )}
      </ErrorPageStyled>
    );
  }
  return (
    <ErrorPageStyled>
      <Typography fontSize="3rem">{500}</Typography>
      <Typography variant="body1">Something went wrong</Typography>
      {refreshFn && (
        <IconButton onClick={() => refreshFn()}>
          <Refresh />
        </IconButton>
      )}
    </ErrorPageStyled>
  );
};
