import { lazy } from 'react';
import { SuspenseLoading } from 'shared/lib';

const Component = lazy(() => import('./MainPage'));

const Index = () => {
  return (
    <SuspenseLoading>
      <Component />
    </SuspenseLoading>
  );
};

export default Index;
