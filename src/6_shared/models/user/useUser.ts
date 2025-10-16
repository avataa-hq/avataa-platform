import keycloak from 'keycloak';
import { KeycloakTokenParsed } from 'keycloak-js';

export const useUser = () => {
  const user: KeycloakTokenParsed | undefined = keycloak.tokenParsed;
  const { tokenParsed } = keycloak;

  return { user, tokenParsed };
};
