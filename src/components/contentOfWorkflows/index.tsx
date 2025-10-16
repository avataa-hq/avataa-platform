import { lazy } from 'react';
import { SuspenseLoading } from 'shared/lib';

const ContentOfWorkflows = lazy(() => import('./ui/ContentOfWorkflows'));

const PageLoader = () => {
  return (
    <SuspenseLoading>
      <ContentOfWorkflows />
    </SuspenseLoading>
  );
};

export default PageLoader;
