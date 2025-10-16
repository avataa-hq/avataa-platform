import { SuspenseLoading } from '../../shared/lib';
import { UserManagement } from './UserManagement';

const Index = () => {
  return (
    <SuspenseLoading>
      <UserManagement />
    </SuspenseLoading>
  );
};

export default Index;
