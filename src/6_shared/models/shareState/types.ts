import { RegisteredActions } from 'store/actionRegistration';

export interface ISavedState {
  page: string;
  componentsState: Record<RegisteredActions, any>;
}
