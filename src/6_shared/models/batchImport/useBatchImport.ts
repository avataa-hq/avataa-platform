import { useStateAndSetters } from '6_shared/lib';
import { batchImportActions, batchImportSliceName } from './batchImportSlice';

export const useBatchImport = () => {
  const { state, setters } = useStateAndSetters({
    actions: batchImportActions,
    stateKey: batchImportSliceName,
  });

  return { ...state, ...setters };
};
