import { useMatomo, useRestoreState } from '../6_shared';
import { AppRouter } from './AppRouter';
import { useSetConfig } from './lib/useSetConfig';

const App = () => {
  // Matomo initialization
  // should happen after the keycloak gives the access to the application,
  // othwerwise the Matomo will be initialized once before logging (which does not make sense) and second time after the logging (which is correct).
  // By calling the hook `useMatomo` inside the `AppRouter` component, we ensure that the Matomo will be initialized after the keycloak gives the access to the application.
  useMatomo();
  useRestoreState();

  const { isConfigLoading } = useSetConfig();

  return <AppRouter isLoading={isConfigLoading} />;
};
export default App;
