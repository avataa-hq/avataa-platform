import { mainModulesContent } from './mainModulesContent';
import { IModule } from '../../6_shared';
import { MainModuleListE } from './mainModuleList';

export const mainModulesConfig: IModule<MainModuleListE>[] = [
  {
    id: MainModuleListE.main,
    label: 'Main',
    isHidden: true,
    content: mainModulesContent[MainModuleListE.main],
    nonClosable: true,
    role: 'mian',
  },

  {
    id: MainModuleListE.dashboard,
    label: 'Dashboard',
    content: mainModulesContent[MainModuleListE.dashboard],
    role: 'dashboardPres',
  },

  {
    id: MainModuleListE.inventory,
    label: 'Inventory',
    content: mainModulesContent[MainModuleListE.inventory],
    role: 'inventory',
  },
  {
    id: MainModuleListE.processManager,
    label: 'Process Manager',
    content: mainModulesContent[MainModuleListE.processManager],
    role: 'processManager',
  },
  // {
  //   id: MainModuleListE.dataflow,
  //   label: 'Dataflow',
  //   content: mainModulesContent[MainModuleListE.dataflow],
  //   role: 'dataflow',
  // },
  {
    id: MainModuleListE.map,
    label: 'Map',
    content: mainModulesContent[MainModuleListE.map],
    role: 'map',
  },

  {
    id: MainModuleListE.diagrams,
    label: 'Diagrams',
    content: mainModulesContent[MainModuleListE.diagrams],
    role: 'diagrams',
  },
  {
    id: MainModuleListE.settings,
    label: 'Settings',
    isGroup: true,
    content: mainModulesContent[MainModuleListE.settings],
    role: 'settings',
  },
  {
    id: MainModuleListE.workflows,
    label: 'Workflows',
    parentId: MainModuleListE.settings,
    content: mainModulesContent[MainModuleListE.workflows],
    role: 'workflows',
  },
  {
    id: MainModuleListE.hierarchies,
    label: 'Hierarchies',
    parentId: MainModuleListE.settings,
    content: mainModulesContent[MainModuleListE.hierarchies],
    role: 'settings-hierarchies',
  },
  {
    id: MainModuleListE.objects,
    label: 'Objects',
    parentId: MainModuleListE.settings,
    content: mainModulesContent[MainModuleListE.objects],
    role: 'settings-objects',
  },
  {
    id: MainModuleListE.graphsSettings,
    label: 'Graphs Settings',
    parentId: MainModuleListE.settings,
    content: mainModulesContent[MainModuleListE.graphsSettings],
    role: 'settings-graphs',
  },
  {
    id: MainModuleListE.templates,
    label: 'Templates',
    parentId: MainModuleListE.settings,
    content: mainModulesContent[MainModuleListE.templates],
    role: 'templates',
  },
  {
    id: MainModuleListE.objectDetails,
    label: 'Object Details',
    isHidden: true,
    parentId: MainModuleListE.settings,
    content: mainModulesContent[MainModuleListE.objectDetails],
    role: 'objectDetails',
  },
  {
    id: MainModuleListE.connectivityDiagram,
    label: 'Connectivity Diagram',
    isHidden: true,
    content: mainModulesContent[MainModuleListE.connectivityDiagram],
    role: 'connectivityDiagram',
  },
];
