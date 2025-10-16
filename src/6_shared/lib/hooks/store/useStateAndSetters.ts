import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { RootState } from 'store';

interface UseCreateSetterProps<
  TActions extends Record<string, (...args: any[]) => any>,
  TStateKey extends keyof RootState,
> {
  actions: TActions;
  stateKey: TStateKey;
}

export const useStateAndSetters = <
  TActions extends Record<string, (...args: any[]) => any>,
  TStateKey extends keyof RootState,
>({
  actions,
  stateKey,
}: UseCreateSetterProps<TActions, TStateKey>) => {
  const dispatch = useAppDispatch();

  const state = useAppSelector((s) => s[stateKey]) as RootState[TStateKey];

  const stableActions = useMemo(() => actions, [actions]);

  const createSetter = useCallback(
    <T extends keyof TActions>(action: T) => {
      return (payload: Parameters<Extract<TActions[T], (...args: any) => any>>[0]) => {
        dispatch(stableActions[action](payload));
      };
    },
    [stableActions, dispatch],
  );

  const setters = useMemo(() => {
    type ActionKeys = Exclude<keyof typeof stableActions, 'restore'>;
    type SetterActions = Extract<ActionKeys, string>;
    // type SetterActions = Extract<ActionKeys, `set${string}`>;

    // Filter setter actions with type guard
    const setterActions = Object.keys(stableActions).filter(
      (key): key is SetterActions => key !== 'restore',
      // (key): key is SetterActions => key.startsWith('set') && key !== 'restore',
    );

    return setterActions.reduce(
      (acc, actionName) => {
        acc[actionName] = createSetter(actionName);
        return acc;
      },
      {} as {
        [K in SetterActions]: (payload: Parameters<(typeof stableActions)[K]>[0]) => void;
      },
    );
  }, [createSetter, stableActions]);

  return { state, setters };
};
