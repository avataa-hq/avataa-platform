import { useStateAndSetters } from '6_shared/lib';
import { paramsResolverActions, paramsResolverSliceName } from './paramsResolverSlice';

export const useParamsResolver = () => {
  const { state, setters } = useStateAndSetters({
    actions: paramsResolverActions,
    stateKey: paramsResolverSliceName,
  });

  return { ...state, ...setters };
};
