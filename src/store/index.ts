import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore } from 'redux-persist';

import {
  inventoryDocumentsApi,
  inventoryNewApi,
  commentsApi,
  objectStateApi,
  securityMiddlewareApi,
  groupApi,
  zeebeApi,
  frontendSettingsApi,
  accountDataApi,
  keycloakApi,
  zeebeClientApi,
  searchApiV2,
  hierarchyBaseApi,
  dataflowApiV3,
  dataviewApi,
  graphApi,
  tasklistApi,
  summaryApi,
  layersMsApi,
  eventManagerApi,
  objectTemplatesApi,
} from '6_shared';

import { hierarchyReducer } from '6_shared/models/hierarchy/hierarchySlice';
import { processManagerReducer } from '6_shared/models/processManager/processManagerSlice';
import { processManagerTableReducer } from '6_shared/models/processManagerTable/processManagerTableSlice';
import { inventoryReducer } from '6_shared/models/inventory/inventorySlice';
import { invTableReducer } from '6_shared/models/inventoryTable/invTableSlice';
import { kanbanBoardReducer } from '6_shared/models/kanbanBoard/kanbanBoardSlice';
import { taskManagerReducer } from '6_shared/models/taskManager/taskManagerSlice';
import { processManagerUserTasksTableReducer } from '6_shared/models/processManagerUserTasksTable/processManagerUserTasksTableSlice';
import { userManagementReducer } from '6_shared/models/userManagement/userManagementSlice';
import { dashboardBasedHierarchyReducer } from '6_shared/models/dashboardBasedHierarchy/slice';
import { associatedObjectsReducer } from '6_shared/models/associatedObjects/associatedObjectsSlice';
import { localeReducer } from '6_shared/models/locale/localeSlice';
import { themeReducer } from '6_shared/models/theme/themeSlice';
import { shareStateReducer } from '6_shared/models/shareState/slice';
import { leftSidebarReducer } from '6_shared/models/leftSidebar/slice';
import { objectDetailsPageReducer } from '6_shared/models/objectDetails/objectDetailsPageSlice';
import { dataflowDiagramPageReducer } from '6_shared/models/dataflowDiagramPage/dataflowDiagramPageSlice';
import { dataflowPageReducer } from '6_shared/models/dataflowPage/dataflowPageSlice';
import { diagramsPageReducer } from '6_shared/models/diagarmsPage/diagramsPageSlice';
import { sidebarReducer } from '6_shared/models/sidebar/sidebarSlice';
import { tabsReducer } from '6_shared/models/tabs/tabSlice';
import { batchImportReducer } from '6_shared/models/batchImport/batchImportSlice';
import { dataflowDiagramReducer } from '6_shared/models/dataflowDiagram/dataflowDiagramSlice';
import { deleteObjectWithLinksReducer } from '6_shared/models/deleteObjectWithLinks/deleteObjectWithLinksSlice';
import { objectCRUDReducer } from '6_shared/models/objectCRUD/objectCRUDSlice';
import { paramsResolverReducer } from '6_shared/models/paramsResolver/paramsResolverSlice';
import { colorsConfigureReducer } from '6_shared/models/colorsConfigure/colorsConfigureSlice';
import { layersReducer } from '6_shared/models/layersSlice/layersSlice';
import { diagramsReducer } from '6_shared/models/diagrams/diagramsSlice';
import { severityReducer } from '6_shared/models/severity/severitySlice';
import { graphsSettingsPageReducer } from '6_shared/models/graphSettingsPage/graphsSettingsSlice';
import { hierarchyBuilderReducer } from '6_shared/models/hierarchyBuilder/hierarchyBuilderSlice';
import { settingsObjectReducer } from '6_shared/models/settingsObject/settingsObjectsSlice';
import { leftPanelWidgetReduser } from '6_shared/models/leftPanelWidget/leftPanelWidgetSlice';
import { dataAuditReducer } from '6_shared/models/dataAudit/dataAuditSlice';
import { workflowsReducer } from '6_shared/models/workflows/workflowsSlice';
import { configReducer } from '6_shared/models/configSlice/configSlice';
import { accountDataReducer } from '6_shared/models/accountData/accountDataSlice';
import { inventoryMapWidgetReducer } from '6_shared/models/inventoryMapWidget/inventoryMapWidgetSlice';

import { errorLogger } from './errorLogger';

const rootReducer = combineReducers({
  shareState: shareStateReducer,
  dashboardBasedHierarchy: dashboardBasedHierarchyReducer,
  dataflowPage: dataflowPageReducer,
  dataflowDiagram: dataflowDiagramReducer,
  dataflowDiagramPage: dataflowDiagramPageReducer,
  graphsSettingsPage: graphsSettingsPageReducer,
  hierarchy: hierarchyReducer,
  hierarchyBuilder: hierarchyBuilderReducer,
  locale: localeReducer,
  settingsObject: settingsObjectReducer,
  userManagement: userManagementReducer,
  sidebar: sidebarReducer,
  tabs: tabsReducer,
  theme: themeReducer,
  workflows: workflowsReducer,
  objectDetailsPage: objectDetailsPageReducer,
  diagrams: diagramsReducer,
  objectCRUD: objectCRUDReducer,
  colorsConfigure: colorsConfigureReducer,
  accountData: accountDataReducer,
  leftPanelWidget: leftPanelWidgetReduser,
  processManagerData: processManagerReducer,
  severity: severityReducer,
  config: configReducer,
  processManagerTable: processManagerTableReducer,
  processManagerUserTasksTable: processManagerUserTasksTableReducer,
  inventory: inventoryReducer,
  inventoryTable: invTableReducer,
  inventoryMapWidget: inventoryMapWidgetReducer,
  associatedObjectsComponent: associatedObjectsReducer,
  diagramsPage: diagramsPageReducer,
  leftSidebar: leftSidebarReducer,
  batchImport: batchImportReducer,
  paramsResolver: paramsResolverReducer,
  deleteObjectWithLinksComponent: deleteObjectWithLinksReducer,
  layers: layersReducer,
  taskManager: taskManagerReducer,
  dataAudit: dataAuditReducer,
  kanbanBoard: kanbanBoardReducer,

  [accountDataApi.reducerPath]: accountDataApi.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
  [objectStateApi.reducerPath]: objectStateApi.reducer,
  [dataflowApiV3.reducerPath]: dataflowApiV3.reducer,
  [dataviewApi.reducerPath]: dataviewApi.reducer,
  [graphApi.reducerPath]: graphApi.reducer,
  [frontendSettingsApi.reducerPath]: frontendSettingsApi.reducer,
  [hierarchyBaseApi.reducerPath]: hierarchyBaseApi.reducer,
  [inventoryDocumentsApi.reducerPath]: inventoryDocumentsApi.reducer,
  [inventoryNewApi.reducerPath]: inventoryNewApi.reducer,
  [keycloakApi.reducerPath]: keycloakApi.reducer,
  [groupApi.reducerPath]: groupApi.reducer,
  [securityMiddlewareApi.reducerPath]: securityMiddlewareApi.reducer,
  [zeebeApi.reducerPath]: zeebeApi.reducer,
  [zeebeClientApi.reducerPath]: zeebeClientApi.reducer,
  [searchApiV2.reducerPath]: searchApiV2.reducer,
  [tasklistApi.reducerPath]: tasklistApi.reducer,
  [summaryApi.reducerPath]: summaryApi.reducer,
  [layersMsApi.reducerPath]: layersMsApi.reducer,
  [eventManagerApi.reducerPath]: eventManagerApi.reducer,
  [objectTemplatesApi.reducerPath]: objectTemplatesApi.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['sidebar', 'tabs', 'theme', 'customization'],
  blacklist: [
    accountDataApi.reducerPath,
    graphApi.reducerPath,
    commentsApi.reducerPath,
    objectStateApi.reducerPath,
    dataflowApiV3.reducerPath,
    dataviewApi.reducerPath,
    frontendSettingsApi.reducerPath,
    hierarchyBaseApi.reducerPath,
    inventoryDocumentsApi.reducerPath,
    inventoryNewApi.reducerPath,
    keycloakApi.reducerPath,
    groupApi.reducerPath,
    securityMiddlewareApi.reducerPath,
    zeebeApi.reducerPath,
    zeebeClientApi.reducerPath,
    searchApiV2.reducerPath,
    tasklistApi.reducerPath,
    summaryApi.reducerPath,
    layersMsApi.reducerPath,
    eventManagerApi.reducerPath,
    objectTemplatesApi.reducerPath,
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const logger = createLogger({
//   collapsed: true
// })

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(
      errorLogger,
      accountDataApi.middleware,
      graphApi.middleware,
      commentsApi.middleware,
      objectStateApi.middleware,
      dataflowApiV3.middleware,
      dataviewApi.middleware,
      frontendSettingsApi.middleware,
      hierarchyBaseApi.middleware,
      inventoryDocumentsApi.middleware,
      inventoryNewApi.middleware,
      keycloakApi.middleware,
      groupApi.middleware,
      securityMiddlewareApi.middleware,
      zeebeApi.middleware,
      zeebeClientApi.middleware,
      searchApiV2.middleware,
      tasklistApi.middleware,
      summaryApi.middleware,
      layersMsApi.middleware,
      eventManagerApi.middleware,
      objectTemplatesApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
