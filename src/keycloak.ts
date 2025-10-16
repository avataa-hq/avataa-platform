import Keycloak from 'keycloak-js';
import config from './config';

const keycloakConfig = {
  url: config._keycloakUrl,
  realm: config._keycloakRealm,
  clientId: config._keycloakClientId,
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
