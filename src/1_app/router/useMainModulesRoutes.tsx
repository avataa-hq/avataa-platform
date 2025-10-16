import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { NotFoundPage, useGetPermissions } from '6_shared';
import { MainModuleListE, MainModulesPathsE, useMainModules } from 'config/mainModulesConfig';
import { TaskEditWidget } from '3_widgets';
import { AdminModuleListE, adminModulesContent, useAdminModules } from 'config/adminModulesConfig';
import { SidebarLayout } from '../layouts/sidebarLayout';
import { mainModulesContent } from '../../config/mainModulesConfig/mainModulesContent';

const componentById = (id: MainModuleListE) => {
  return mainModulesContent[id].component;
};

const adminComponentById = (id: AdminModuleListE) => {
  return adminModulesContent[id].component;
};

interface IProps {
  isLoadingSidebarLayout?: boolean;
  isLoadingSidPanelsLayout?: boolean;
}

export const useMainModulesRoutes = ({
  isLoadingSidebarLayout,
  isLoadingSidPanelsLayout,
}: IProps) => {
  const { mainModulesList } = useMainModules();
  const { adminModulesList } = useAdminModules();

  const PMPermissions = useGetPermissions('processManager');

  return useMemo(() => {
    return createBrowserRouter([
      {
        element: <SidebarLayout isLoading={isLoadingSidebarLayout} modules={mainModulesList} />,
        errorElement: <NotFoundPage pathToMainPage="/main" errorMessage="Something went wrong" />,
        children: [
          {
            index: true,
            element: componentById(MainModuleListE.main),
          },
          {
            path: MainModuleListE.main,
            element: componentById(MainModuleListE.main),
          },
          {
            path: MainModuleListE.taskManager,
            element: componentById(MainModuleListE.taskManager),
          },
          {
            path: MainModuleListE.dashboard,
            element: componentById(MainModuleListE.dashboard),
          },

          {
            path: MainModuleListE.inventory,
            element: componentById(MainModuleListE.inventory),
          },
          {
            path: MainModuleListE.processManager,
            children: [
              { index: true, element: componentById(MainModuleListE.processManager) },
              {
                path: MainModulesPathsE.taskId,
                element: <TaskEditWidget permissions={PMPermissions} />,
              },
            ],
          },
          {
            path: MainModuleListE.dataflow,
            element: componentById(MainModuleListE.dataflow),
          },
          {
            path: MainModuleListE.map,
            element: componentById(MainModuleListE.map),
          },
          {
            path: MainModuleListE.diagrams,
            element: componentById(MainModuleListE.diagrams),
          },
          {
            path: MainModuleListE.settings,
            element: componentById(MainModuleListE.settings),
          },
          {
            path: MainModuleListE.workflows,
            element: componentById(MainModuleListE.workflows),
          },
          {
            path: MainModuleListE.hierarchies,
            element: componentById(MainModuleListE.hierarchies),
          },
          {
            path: MainModuleListE.objects,
            element: componentById(MainModuleListE.objects),
          },
          {
            path: MainModuleListE.graphsSettings,
            element: componentById(MainModuleListE.graphsSettings),
          },
          {
            path: MainModuleListE.templates,
            element: componentById(MainModuleListE.templates),
          },
          {
            path: MainModuleListE.objectDetails,
            element: componentById(MainModuleListE.objectDetails),
          },
          {
            path: MainModuleListE.connectivityDiagram,
            element: componentById(MainModuleListE.connectivityDiagram),
          },
        ],
      },
      {
        element: <SidebarLayout isLoading={false} modules={adminModulesList} />,
        children: [
          { index: true, element: adminComponentById(AdminModuleListE.adminMain) },
          {
            path: AdminModuleListE.adminMain,
            element: adminComponentById(AdminModuleListE.adminMain),
          },
          {
            path: AdminModuleListE.userManagement,
            element: adminComponentById(AdminModuleListE.userManagement),
          },
          {
            path: AdminModuleListE.moduleManagement,
            element: adminComponentById(AdminModuleListE.moduleManagement),
          },
          {
            path: AdminModuleListE.systemManagement,
            element: adminComponentById(AdminModuleListE.systemManagement),
          },
          {
            path: AdminModuleListE.auditPage,
            element: adminComponentById(AdminModuleListE.auditPage),
          },
        ],
      },
    ]);
  }, [isLoadingSidebarLayout, mainModulesList, PMPermissions, adminModulesList]);
};
