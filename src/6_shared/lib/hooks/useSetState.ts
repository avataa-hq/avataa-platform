import { useCallback, useState } from 'react';

type TSetState<T> = (newPartialState: Partial<T>) => void;

/**
 *
 * Good'n old this.setState :)
 *
 * @param initialState
 * @returns
 */
export const useSetState = <T extends object>(initialState: T): [T, TSetState<T>] => {
  const [state, setState] = useState<T>(initialState);
  const setCustomState = useCallback((newPartialState: Partial<T>) => {
    try {
      setState((prevState): T => ({ ...prevState, ...newPartialState }));
    } catch (error) {
      console.error(error);
    }
  }, []);
  return [state, setCustomState];
};
