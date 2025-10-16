import { useStateAndSetters } from '6_shared/lib';
import { graphsSettingsPageActions, graphsSettingsPageSliceName } from './graphsSettingsSlice';

export const useGraphSettingsPage = () => {
  const { state, setters } = useStateAndSetters({
    actions: graphsSettingsPageActions,
    stateKey: graphsSettingsPageSliceName,
  });

  return { ...state, ...setters };
};
