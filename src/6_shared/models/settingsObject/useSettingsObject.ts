import { useStateAndSetters } from '6_shared/lib';
import { settingsObjectActions, settingsObjectSliceName } from './settingsObjectsSlice';

export const useSettingsObject = () => {
  const { state, setters } = useStateAndSetters({
    actions: settingsObjectActions,
    stateKey: settingsObjectSliceName,
  });

  return { ...state, ...setters };
};
