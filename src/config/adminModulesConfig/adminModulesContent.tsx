import {
  AccountTreeTwoTone,
  EmojiObjects,
  People,
  RoomPreferencesOutlined,
  SettingsSuggest,
  Tune,
  VerifiedUser,
} from '@mui/icons-material';

import { AdminMainPage } from '2_pages/adminMainPage/AdminMainPage';
import UserManagement from '2_pages/adminUserManagement';
import { ModuleManagement } from '2_pages/adminModuleManagement';
import { SystemManagement } from '2_pages/adminSystemManagement';
import { AuditPage } from '2_pages/adminAuditPage';

import { IModuleContent } from '6_shared';
import { AdminModuleListE } from './adminModuleList';

export const adminModulesContent: Record<AdminModuleListE, IModuleContent> = {
  [AdminModuleListE.adminMain]: {
    icon: <RoomPreferencesOutlined />,
    component: <AdminMainPage />,
  },
  [AdminModuleListE.userManagement]: {
    icon: <People />,
    component: <UserManagement />,
  },
  [AdminModuleListE.moduleManagement]: {
    icon: <SettingsSuggest />,
    component: <ModuleManagement />,
  },
  [AdminModuleListE.systemManagement]: {
    icon: <Tune />,
    component: <SystemManagement />,
  },
  [AdminModuleListE.auditPage]: {
    icon: <VerifiedUser />,
    component: <AuditPage />,
  },
};
