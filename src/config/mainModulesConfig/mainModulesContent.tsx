import RoomPreferencesOutlined from '@mui/icons-material/RoomPreferencesOutlined';

import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import TableView from '@mui/icons-material/TableView';
import Warning from '@mui/icons-material/Warning';
import Map from '@mui/icons-material/Map';

import AccountTree from '@mui/icons-material/AccountTree';
import Settings from '@mui/icons-material/Settings';
import Schema from '@mui/icons-material/Schema';
import AccountTreeTwoTone from '@mui/icons-material/AccountTreeTwoTone';
import SchemaRounded from '@mui/icons-material/SchemaRounded';
import SnippetFolder from '@mui/icons-material/SnippetFolder';
import RuleFolder from '@mui/icons-material/RuleFolder';
import { IModuleContent } from '6_shared';

import ContentOfWorkflows from 'components/contentOfWorkflows';
import SettingsHierarchy from 'components/contentOfSettings/hierarchies';
import SettingsObjects from 'components/contentOfSettings/objects';

import MapPage from '2_pages/map';
import InventoryPage from '2_pages/inventory';
import ProcessManagerPage from '2_pages/processManager';
import ObjectDetailsPage from '2_pages/objectDetails';
import MainPage from '2_pages/main';
import Diagrams from '2_pages/diagrams';
import GraphsSettings from '2_pages/graphsSettings';
import ConnectivityDiagramPage from '2_pages/connectivityDiagram';
import TaskManager from '2_pages/taskPlannerPage';
import DashboardBasedHierarchy from '2_pages/dashboardBasedHierarchy';
import ObjectTemplates from '2_pages/templatesPage';
import RuleManagerPage from '2_pages/dataflow';

import { MainModuleListE } from './mainModuleList';

export const mainModulesContent: Record<MainModuleListE, IModuleContent> = {
  [MainModuleListE.main]: {
    icon: <RoomPreferencesOutlined />,
    component: <MainPage />,
  },
  [MainModuleListE.dataflow]: {
    icon: <RuleFolder />,
    component: <RuleManagerPage />,
  },

  [MainModuleListE.taskManager]: {
    component: <TaskManager />,
  },

  [MainModuleListE.dashboard]: {
    icon: <SpaceDashboard />,
    component: <DashboardBasedHierarchy />,
  },

  [MainModuleListE.inventory]: {
    icon: <TableView />,
    component: <InventoryPage />,
  },
  [MainModuleListE.processManager]: {
    icon: <Warning />,
    component: <ProcessManagerPage />,
  },
  [MainModuleListE.map]: {
    icon: <Map />,
    component: <MapPage />,
  },
  [MainModuleListE.diagrams]: {
    icon: <AccountTree />,
    component: <Diagrams />,
  },
  [MainModuleListE.settings]: {
    icon: <Settings />,
  },
  [MainModuleListE.workflows]: {
    icon: <Schema />,
    component: <ContentOfWorkflows />,
  },
  [MainModuleListE.hierarchies]: {
    icon: <AccountTreeTwoTone />,
    component: <SettingsHierarchy />,
  },
  [MainModuleListE.objects]: {
    icon: <RoomPreferencesOutlined />,
    component: <SettingsObjects />,
  },
  [MainModuleListE.graphsSettings]: {
    icon: <SchemaRounded />,
    component: <GraphsSettings />,
  },
  [MainModuleListE.templates]: {
    icon: <SnippetFolder />,
    component: <ObjectTemplates />,
  },
  [MainModuleListE.objectDetails]: {
    icon: <AccountTreeTwoTone />,
    component: <ObjectDetailsPage />,
  },
  [MainModuleListE.connectivityDiagram]: {
    icon: <AccountTreeTwoTone />,
    component: <ConnectivityDiagramPage />,
  },
};
