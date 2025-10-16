import { createApi } from '@reduxjs/toolkit/query/react';
import config from 'config';
import setDefaultApiSettings from '../config/defaultSettingApiOld';

export const keycloakApi = createApi({
  ...setDefaultApiSettings(
    'keycloakApi',
    `${config._keycloakUrl}admin/realms/${config._keycloakRealm}`,
    ['Users', 'Groups', 'Roles', 'Clients'],
  ),
  endpoints: () => ({}),
});
