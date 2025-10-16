import { SecurityMiddlewareLowLevelModel } from '6_shared';

export interface SecurityLowLevelRoles extends SecurityMiddlewareLowLevelModel {
  disabled?: {
    status: boolean;
    rootItemId: number | null;
  };
}
