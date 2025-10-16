import { useStateAndSetters } from '6_shared/lib';
import { leftPanelWidgetActions, leftPanelWidgetSliceName } from './leftPanelWidgetSlice';

export const useLeftPanelWidget = () => {
  const { state, setters } = useStateAndSetters({
    actions: leftPanelWidgetActions,
    stateKey: leftPanelWidgetSliceName,
  });

  return { ...state, ...setters };
};
