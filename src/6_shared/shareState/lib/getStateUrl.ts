import { ISavedState } from '6_shared/models';
import { RootState } from 'store';

const getInitialComponentsState = (state: RootState, components: string[]) => {
  return components.reduce((acc, component) => {
    acc[component] = state[component];
    return acc;
  }, {} as Record<string, any>);
};

export const getStateUrl = async (state: RootState, postStateFn: any, linkExpires: number = 1) => {
  const { components, page } = state.shareState;
  const url = new URL(window.location.href);

  const componentsState = getInitialComponentsState(state, components);
  const savedState: ISavedState = { page, componentsState };

  const idState = await postStateFn({
    expires_in_minutes: linkExpires,
    state: savedState,
  }).unwrap();

  if (idState) return `${url.origin}${url.pathname}?stateId=${idState}`;
  return null;
};
