import { ISavedState } from '6_shared/models';
import { AppDispatch } from 'store';
import { actionRegistration, RegisteredActions } from 'store/actionRegistration';

export const restoreStates = (savedState: ISavedState, dispatch: AppDispatch) => {
  // TODO need to navigate to savedState.page

  Object.entries(savedState.componentsState).forEach(([component, state]) => {
    const currentComponent = component as RegisteredActions;
    if (
      actionRegistration[currentComponent] &&
      actionRegistration[currentComponent].hasOwnProperty('restore')
    ) {
      // @ts-ignore
      dispatch(actionRegistration[currentComponent].restore(state));
    }
  });
};
