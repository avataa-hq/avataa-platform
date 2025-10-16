import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { LoadingAvataa, LoadingContainer, SnackbarProvider } from '../6_shared';
import ThemeProvider from '../theme/ThemeProvider';
import store, { persistor } from '../store';
import { apolloClient } from '../6_shared/graphQL';
import keycloak from '../keycloak';

const LoadingComponent = () => {
  return (
    <LoadingContainer>
      <LoadingAvataa />
    </LoadingContainer>
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'login-required',
        scope: 'profile',
        redirectUri: `${window.location.origin}${window.location.pathname}${window.location.search}`,
      }}
      LoadingComponent={<LoadingComponent />}
    >
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <PersistGate loading={<LoadingComponent />} persistor={persistor}>
            <ThemeProvider>
              {children}
              <SnackbarProvider />
            </ThemeProvider>
          </PersistGate>
        </ApolloProvider>
      </Provider>
    </ReactKeycloakProvider>
  );
};
