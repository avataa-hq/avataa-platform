import { getErrorMessage, useDebounceValue, useTranslate } from '6_shared';
import { Circle } from '@mui/icons-material';
import { Box, BoxProps, CircularProgress, Typography } from '@mui/material';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { enqueueSnackbar } from 'notistack';
import { MouseEvent, useCallback, useEffect, useState } from 'react';

interface ConnectionStatusProps extends Omit<BoxProps, 'component'> {
  requestBody: Record<string, any>;
  requestFn: MutationTrigger<any>;
  skipAutoCheck?: boolean;
}

export const ConnectionStatus = ({
  requestBody,
  requestFn,
  skipAutoCheck,
  onClick,
  ...props
}: ConnectionStatusProps) => {
  const translate = useTranslate();
  const debouncedBody = useDebounceValue(requestBody, 1500);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(true);

  const checkConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      await requestFn(debouncedBody).unwrap();
      setIsError(false);
      setIsLoading(false);
      enqueueSnackbar(translate('Connected'), { variant: 'success' });
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  }, [debouncedBody, requestFn, translate]);

  useEffect(() => {
    if (skipAutoCheck) return;
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkConnection]);

  return (
    <Box
      component="div"
      display="flex"
      gap="5px"
      alignItems="center"
      sx={{ cursor: 'pointer' }}
      onClick={(e) => {
        checkConnection();
        onClick?.(e);
      }}
      {...props}
    >
      {isLoading ? (
        <CircularProgress size={24} />
      ) : (
        <Circle sx={{ p: '5px' }} color={isError ? 'error' : 'success'} />
      )}
      <Typography>{translate('Connection')}</Typography>
    </Box>
  );
};
