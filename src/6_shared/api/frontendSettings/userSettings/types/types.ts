import { IUSObjectTypesComponent } from './components.interfaces';

export type IUserSettingsModel = {
  settings: {
    // components states here

    'component:object_types'?: IUSObjectTypesComponent | null;

    // modules states here
  };
};

export type UserSettingsUniqueKeys = keyof IUserSettingsModel['settings'];

export type IUserSettingsBody<T extends UserSettingsUniqueKeys = UserSettingsUniqueKeys> = {
  key: T;
  body: {
    settings: IUserSettingsModel['settings'][T];
  };
};
