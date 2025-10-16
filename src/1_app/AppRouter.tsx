import { useMemo } from 'react';
import { RouteObject, createBrowserRouter, RouterProvider } from 'react-router-dom';
import keycloak from '../keycloak';
import ErrorBoundary from '../6_shared/ui/errorBoundary/ErrorBoundary';
import { useMainModulesRoutes } from './router';

interface IProps {
  isLoading?: boolean;
}

export const AppRouter = ({ isLoading }: IProps) => {
  const isAuth = keycloak.authenticated ?? false;

  const mainModulesRoutes = useMainModulesRoutes({ isLoadingSidebarLayout: isLoading });

  const router = useMemo(() => {
    const unAuthorizedRoutes: RouteObject[] = [{ path: '*', element: <div>Unauthorized</div> }];
    return isAuth ? mainModulesRoutes : createBrowserRouter(unAuthorizedRoutes);
  }, [isAuth, mainModulesRoutes]);

  return (
    <ErrorBoundary
      hideErrorPage
      onError={(error) => {
        if (
          error.message.includes('Failed to fetch dynamically imported module') ||
          error.message.includes('Importing a module script failed')
        ) {
          // Sometimes, and error with dynamically imported modules occures.
          // When this is happening, a page refresh is needed and the error is gone.
          // eslint-disable-next-line no-restricted-globals
          location.reload();
        }
      }}
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};
