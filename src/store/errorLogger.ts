import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';

export const errorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action) && action.meta?.arg?.type === 'mutation' && action.error) {
    console.warn('We got a rejected action!');
    // enqueueSnackbar('You are not allowed to perform this action', { variant: 'error' });
  }

  return next(action);
};
