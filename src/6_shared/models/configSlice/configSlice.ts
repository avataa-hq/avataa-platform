import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '6_shared';

export interface ConfigType {
  _vaultURL: string;
  _vaultSecret: string;

  _clickhouseUrl: string;
  _clickhouseName: string;
  _clickhousePass: string;
  _clickhouseCorsDisable: string;

  _apiBase8000: string;
  _apiBase8100: string;
  _apiBase8101: string;
  _apiBase8001: string;
  _apiBase8001v2: string;
  _apiBase8003: string;
  _apiBase8004: string;
  _apiBase8004FrontendSettings: string;
  _apiBase8005: string;
  _apiBaseBuilding: string;
  _apiBaseDataflowV2: string;
  _apiBaseSearchV2: string;
  _apiBaseSearchV3: string;
  _externalDashboardsApiBase: string;
  _assistantApiBase: string;
  _objectStateApiBase: string;
  _summaryApiBase: string;

  _keycloakUrl: string;
  _keycloakRealm: string;
  _keycloakClientId: string;
  _keycloakTestUrl: string;
  _mapApiKey: string;
  _mapArcGisApiKey: string;
  _table_Data_Grid_License_Key: string;
  _mapboxApiAccessToken: string;
  _availableLocales: string;

  _processGroupApiBase: string;

  _camundaTasklist: string;
  _camundaOperate: string;
  _camundaClientId: string;
  _camundaRealm: string;
  _camundaUsername: string;
  _camundaPassword: string;
  _camundaZeebeClient: string;

  _airflowApiBase: string;
  _airflowUsername: string;
  _airflowPassword: string;

  _commentsApiBase: string;
  _capacityApiBase: string;
  _dataflowV3ApiBase: string;
  _dataviewApiBase: string;
  _graphApiBase: string;
  _securityMiddlewareApi: string;

  _logoLightLarge: string;
  _logoLightSmall: string;
  _favicon: string;
  _pageTitle: string;

  _theme: string;

  processMapBaseUrl: string;
  processDashboardBaseUrl: string;
  processRuleBaseUrl: string;

  _liveUpdateHTTPLink: string;
  _liveUpdateWebsocketLink: string;

  _matomoBaseUrl: string;
  _matomoSiteId: string;

  _kafkaUI: string;
  _kibanaUI: string;
  _elasticSearchUI: string;
  _camundaOperateUI: string;
  _camundaTasklistUI: string;
  _camundaOptimizeUI: string;
  _camundaIdentityUI: string;
  _apacheAirflowIU: string;
  _apacheSupersetUI: string;
  _grafanaUI: string;
  _uptimeKumaUI: string;
  _nextcloud: string;
  _openprojectUI: string;
  _testrailUI: string;
  _minioUI: string;
  _pgAdminUI: string;

  _map_initial_latitude: string;
  _map_initial_longitude: string;
  _map_allowed_search_counties: string;
  _disable_timezone_adjustment: string;
  _graphAssistantBase: string;
  _layersApiBase: string;
  _eventManagerApiBase: string;
  _objectTemplatesApiBase: string;
}

const initialState: {
  config: ConfigType;
  userInfo: UserInfo | null;
  userRoles: string[] | null;
} = {
  config: {
    _vaultURL: import.meta.env.REACT_APP_VAULT_URL ?? '',
    _vaultSecret: import.meta.env.REACT_APP_VAULT_SECRET ?? '',
    _clickhouseUrl: import.meta.env.REACT_APP_CLICKHOUSE_API_BASE ?? '',
    _clickhouseName: import.meta.env.REACT_APP_CLICKHOUSE_USERNAME ?? '',
    _clickhousePass: import.meta.env.REACT_APP_CLICKHOUSE_PASSWORD ?? '',
    _clickhouseCorsDisable: import.meta.env.REACT_APP_CLICKHOUSE_CORS_DISABLE ?? '',
    _apiBase8000: import.meta.env.REACT_APP_INVENTORY_API_BASE ?? '',
    _apiBase8100: import.meta.env.REACT_APP_HIERARCHY_API_BASE ?? '',
    _apiBase8101: import.meta.env.REACT_APP_DOCUMENTS_API_BASE ?? '',
    _apiBase8001: import.meta.env.REACT_APP_GEODATA_API_BASE ?? '',
    _apiBase8001v2: import.meta.env.REACT_APP_GEODATA_API_BASE_V2 ?? '',
    _apiBase8003: import.meta.env.REACT_APP_DATAFLOW_API_BASE ?? '',
    _apiBase8004: import.meta.env.REACT_APP_PLANNING_API_BASE ?? '',
    _apiBase8004FrontendSettings: import.meta.env.REACT_APP_FRONTEND_SETTINGS_API_BASE ?? '',
    _apiBase8005: import.meta.env.REACT_APP_PROJECT_API_BASE ?? '',
    _apiBaseBuilding: import.meta.env.REACT_APP_BUILDING_API_BASE_V1 ?? '',
    _objectStateApiBase: import.meta.env.REACT_APP_OBJECT_STATE_API_BASE ?? '',
    _apiBaseDataflowV2: import.meta.env.REACT_APP_DATAFLOW_API_BASE_V2 ?? '',
    _apiBaseSearchV2: import.meta.env.REACT_APP_SEARCH_API_BASE_V2 ?? '',
    _apiBaseSearchV3: import.meta.env.REACT_APP_SEARCH_API_BASE_V3 ?? '',
    _dataflowV3ApiBase: import.meta.env.REACT_APP_DATAFLOW_API_BASE_V3 ?? '',
    _dataviewApiBase: import.meta.env.REACT_APP_DATAVIEW_API_BASE ?? '',
    _graphApiBase: import.meta.env.REACT_APP_GRAPH_API_BASE ?? '',
    _externalDashboardsApiBase: import.meta.env.REACT_APP_POWER_BI_API_BASE ?? '',
    _mapApiKey: import.meta.env.REACT_APP_GOOGLE_API_KEY ?? '',
    _mapArcGisApiKey: import.meta.env.REACT_APP_ARCGIS_API_KEY ?? '',
    _assistantApiBase: import.meta.env.REACT_APP_ASSISTANT_API_BASE ?? '',
    _keycloakUrl: import.meta.env.REACT_APP_KEYCLOAK_URL ?? '',
    _keycloakRealm: import.meta.env.REACT_APP_KEYCLOAK_REALM ?? '',
    _keycloakClientId: import.meta.env.REACT_APP_KEYCLOAK_CLIENT_ID ?? '',
    _keycloakTestUrl: import.meta.env.REACT_APP_KEYCLOAK_TEST_URL ?? '',
    _table_Data_Grid_License_Key: import.meta.env.REACT_APP_TABLE_DATA_GRID_LICENSE_KEY ?? '',
    _mapboxApiAccessToken: import.meta.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN ?? '',
    _processGroupApiBase: import.meta.env.REACT_APP_PROCESS_GROUP_API_BASE ?? '',
    _availableLocales: import.meta.env.REACT_APP_AVAILABLE_LOCALES ?? '',
    _camundaTasklist: import.meta.env.REACT_APP_CAMUNDA_TASKLIST_GRAPHQL_API ?? '',
    _camundaOperate: import.meta.env.REACT_APP_CAMUNDA_API ?? '',
    _camundaClientId: import.meta.env.REACT_APP_CAMUNDA_CLIENT_ID ?? '',
    _camundaRealm: import.meta.env.REACT_APP_CAMUNDA_REALM ?? '',
    _camundaUsername: import.meta.env.REACT_APP_CAMUNDA_USERNAME ?? '',
    _camundaPassword: import.meta.env.REACT_APP_CAMUNDA_PASSWORD ?? '',
    _camundaZeebeClient: import.meta.env.REACT_APP_ZEEBE_CLIENT_API_BASE ?? '',
    _airflowApiBase: import.meta.env.REACT_APP_AIRFLOW_API ?? '',
    _airflowUsername: import.meta.env.REACT_APP_AIRFLOW_USERNAME ?? '',
    _airflowPassword: import.meta.env.REACT_APP_AIRFLOW_PASSWORD ?? '',
    _commentsApiBase: import.meta.env.REACT_APP_COMMENTS_API_BASE ?? '',
    _capacityApiBase: import.meta.env.REACT_APP_CAPACITY_API_BASE ?? '',
    _securityMiddlewareApi: import.meta.env.REACT_APP_SECURITY_MIDDLEWARE_API_BASE ?? '',
    _logoLightLarge: import.meta.env.REACT_APP_LOGO_LIGHT_LARGE ?? '',
    _logoLightSmall: import.meta.env.REACT_APP_LOGO_LIGHT_SMALL ?? '',
    _favicon: import.meta.env.REACT_APP_FAVICON ?? '',
    _pageTitle: import.meta.env.REACT_APP_PAGE_TITLE ?? '',
    _theme: import.meta.env.REACT_APP_THEME ?? '',
    processMapBaseUrl: import.meta.env.REACT_APP_PROCESS_MAP_BASE_URL ?? '',
    processDashboardBaseUrl: import.meta.env.REACT_APP_PROCESS_DASHBOARD_BASE_URL ?? '',
    processRuleBaseUrl: import.meta.env.REACT_APP_PROCESS_RULE_BASE_URL ?? '',
    _liveUpdateHTTPLink: import.meta.env.REACT_APP_LIVE_UPDATE_BASE ?? '',
    _liveUpdateWebsocketLink: import.meta.env.REACT_APP_LIVE_UPDATE_GRAPHQL_WEBSOCKET_BASE ?? '',
    _matomoBaseUrl: import.meta.env.REACT_APP_MATOMO_BASE_URL ?? '',
    _matomoSiteId: import.meta.env.REACT_APP_MATOMO_SITE_ID ?? '',
    _kafkaUI: import.meta.env.REACT_APP_KAFKA_UI ?? '',
    _kibanaUI: import.meta.env.REACT_APP_KIBANA_UI ?? '',
    _elasticSearchUI: import.meta.env.REACT_APP_ELASTICSEARCH_UI ?? '',
    _camundaOperateUI: import.meta.env.REACT_APP_CAMUNDA_OPERATE_UI ?? '',
    _camundaTasklistUI: import.meta.env.REACT_APP_CAMUNDA_TASKLIST_UI ?? '',
    _camundaOptimizeUI: import.meta.env.REACT_APP_CAMUNDA_OPTIMIZE_UI ?? '',
    _camundaIdentityUI: import.meta.env.REACT_APP_CAMUNDA_IDENTITY_UI ?? '',
    _apacheAirflowIU: import.meta.env.REACT_APP_APACHE_AIRFLOW_UI ?? '',
    _apacheSupersetUI: import.meta.env.REACT_APP_APACHE_SUPERSET_UI ?? '',
    _grafanaUI: import.meta.env.REACT_APP_GRAFANA_UI ?? '',
    _uptimeKumaUI: import.meta.env.REACT_APP_UPTIME_KUMA_UI ?? '',
    _nextcloud: import.meta.env.REACT_APP_NEXTCLOUD_UI ?? '',
    _openprojectUI: import.meta.env.REACT_APP_OPENPROJECT_UI ?? '',
    _testrailUI: import.meta.env.REACT_APP_TESTRAIL_UI ?? '',
    _minioUI: import.meta.env.REACT_APP_MINIO_UI ?? '',
    _pgAdminUI: import.meta.env.REACT_APP_PGADMIN_UI ?? '',
    _map_initial_latitude: import.meta.env.REACT_APP_INITIAL_LATITUDE ?? '',
    _map_initial_longitude: import.meta.env.REACT_APP_INITIAL_LONGITUDE ?? '',
    _map_allowed_search_counties: import.meta.env.REACT_APP_ALLOWED_SEARCH_COUNTRIES ?? '',
    _summaryApiBase: import.meta.env.REACT_APP_SUMMARY_API_BASE ?? '',
    _disable_timezone_adjustment: import.meta.env.REACT_APP_DISABLE_TIMEZONE_ADJUSTMENT ?? '',
    _graphAssistantBase: import.meta.env.REACT_APP_GRAPH_ASSISTANT_BASE ?? '',
    _layersApiBase: import.meta.env.REACT_APP_LAYERS_API_BASE ?? '',
    _eventManagerApiBase: import.meta.env.REACT_APP_EVENT_MANAGER_API_BASE ?? '',
    _objectTemplatesApiBase: import.meta.env.REACT_APP_OBJECT_TEMPLATES_API_BASE ?? '',
  },
  userInfo: null,
  userRoles: null,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig: (state, { payload }: PayloadAction<Partial<ConfigType>>) => {
      state.config = {
        ...state.config,
        ...payload,
      };
    },
    setUserInfo: (state, { payload }: PayloadAction<UserInfo>) => {
      state.userInfo = payload;
      const roles: string[] = [];
      roles.push(...(payload.realm_access?.roles || []));
      if (payload.resource_access) {
        Object.values(payload.resource_access).forEach((roleArray) => {
          roles.push(...(roleArray.roles || []));
        });
      }
      state.userRoles = roles;
    },
  },
});

export const configActions = configSlice.actions;
export const configReducer = configSlice.reducer;
export const configSliceName = configSlice.name;
