import { useStateAndSetters } from '6_shared/lib';
import { dataAuditActions, dataAuditSliceName } from './dataAuditSlice';

export const useDataAudit = () => {
  const { state, setters } = useStateAndSetters({
    actions: dataAuditActions,
    stateKey: dataAuditSliceName,
  });

  return { ...state, ...setters };
};
