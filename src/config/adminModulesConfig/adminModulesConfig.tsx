import { IModule } from '../../6_shared';
import { AdminModuleListE } from './adminModuleList';

import { adminModulesContent } from './adminModulesContent';

export const adminModulesConfig: IModule<AdminModuleListE>[] = [
  {
    id: AdminModuleListE.adminMain,
    label: 'Main',
    isHidden: true,
    content: adminModulesContent[AdminModuleListE.adminMain],
    nonClosable: true,
    role: 'main',
  },
  {
    id: AdminModuleListE.userManagement,
    label: 'User Management',
    content: adminModulesContent[AdminModuleListE.userManagement],
    role: 'userManagement',
  },
  {
    id: AdminModuleListE.moduleManagement,
    label: 'Module Management',
    content: adminModulesContent[AdminModuleListE.moduleManagement],
    role: 'moduleManagement',
  },
  {
    id: AdminModuleListE.systemManagement,
    label: 'System Management',
    content: adminModulesContent[AdminModuleListE.systemManagement],
    role: 'systemManagement',
  },
  {
    id: AdminModuleListE.auditPage,
    label: 'Audit Page',
    content: adminModulesContent[AdminModuleListE.auditPage],
    role: 'auditPage',
  },
];
