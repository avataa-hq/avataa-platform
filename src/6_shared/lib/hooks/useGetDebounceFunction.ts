import { useMemo } from 'react';
import { getDebounceFunction } from '../utils';

export const useGetDebounceFunction = (fn: (...args: any[]) => any, delay: number = 500) => {
  return useMemo(() => getDebounceFunction(fn, delay), [delay, fn]);
};
