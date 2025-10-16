import { useEffect } from 'react';
import { RegisteredActions } from 'store/actionRegistration';
import { useShareState } from '6_shared/models';

export const useRegistration = (component: RegisteredActions | RegisteredActions[]) => {
  const { componentsRegistration, componentsUnRegistration } = useShareState();

  const reg = (comp: string | string[]) => {
    componentsRegistration(comp);
  };
  const unReg = (comp: string | string[]) => {
    componentsUnRegistration(comp);
  };

  useEffect(() => {
    reg(component);
    return () => unReg(component);
  }, []);

  return null;
};
