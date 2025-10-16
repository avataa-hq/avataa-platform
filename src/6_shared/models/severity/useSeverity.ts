import { useStateAndSetters } from '6_shared/lib';
import { severityActions, severitySliceName } from './severitySlice';

export const useSeverity = () => {
  const { state, setters } = useStateAndSetters({
    actions: severityActions,
    stateKey: severitySliceName,
  });

  return { ...state, ...setters };
};
