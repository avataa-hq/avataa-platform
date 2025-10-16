import cfg from '../config/development';

export interface ConfigType {
  _vaultSecret: string;
  _vaultURL: string;
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
  _externalDashboardsApiBase: string;
  _apiBaseSearchV2: string;
  _apiBaseSearchV3: string;
  _assistantApiBase: string;
  _graphAssistantBase: string;
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
  _camundaRealm: string;
  _camundaClientId: string;
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
  _layersApiBase: string;
  _eventManagerApiBase: string;
  _objectTemplatesApiBase: string;
}

const config: ConfigType = {
  _vaultSecret: '',
  _vaultURL: '',
  _clickhouseUrl: '',
  _clickhouseName: '',
  _clickhousePass: '',
  _clickhouseCorsDisable: '',
  _apiBase8000: '',
  _apiBase8100: '',
  _apiBase8101: '',
  _apiBase8001: '',
  _apiBase8001v2: '',
  _apiBase8003: '',
  _apiBase8004: '',
  _apiBase8004FrontendSettings: '',
  _apiBase8005: '',
  _apiBaseSearchV2: '',
  _apiBaseSearchV3: '',
  _apiBaseDataflowV2: '',
  _apiBaseBuilding: '',
  _assistantApiBase: '',
  _summaryApiBase: '',
  _keycloakUrl: '',
  _keycloakRealm: '',
  _keycloakClientId: '',
  _keycloakTestUrl: '',
  _mapApiKey: '',
  _mapArcGisApiKey: '',
  _table_Data_Grid_License_Key: '',
  _mapboxApiAccessToken: '',
  _availableLocales: '',
  _camundaTasklist: '',
  _camundaRealm: '',
  _camundaOperate: '',
  _camundaClientId: '',
  _camundaUsername: '',
  _camundaPassword: '',
  _camundaZeebeClient: '',
  _airflowApiBase: '',
  _airflowUsername: '',
  _airflowPassword: '',
  _commentsApiBase: '',
  _capacityApiBase: '',
  _dataflowV3ApiBase: '',
  _dataviewApiBase: '',
  _graphApiBase: '',
  _securityMiddlewareApi: '',
  _logoLightLarge: '',
  _logoLightSmall: '',
  _favicon: '',
  _pageTitle: '',
  _theme: '',
  processDashboardBaseUrl: '',
  processMapBaseUrl: '',
  processRuleBaseUrl: '',
  _externalDashboardsApiBase: '',
  _processGroupApiBase: '',
  _liveUpdateHTTPLink: '',
  _liveUpdateWebsocketLink: '',
  _matomoBaseUrl: '',
  _matomoSiteId: '',
  _kafkaUI: '',
  _kibanaUI: '',
  _elasticSearchUI: '',
  _camundaOperateUI: '',
  _camundaTasklistUI: '',
  _camundaOptimizeUI: '',
  _camundaIdentityUI: '',
  _apacheAirflowIU: '',
  _apacheSupersetUI: '',
  _grafanaUI: '',
  _uptimeKumaUI: '',
  _nextcloud: '',
  _openprojectUI: '',
  _testrailUI: '',
  _minioUI: '',
  _pgAdminUI: '',

  _map_initial_latitude: '',
  _map_initial_longitude: '',
  _map_allowed_search_counties: '',
  _disable_timezone_adjustment: '',
  _graphAssistantBase: '',
  _layersApiBase: '',
  _eventManagerApiBase: '',
  _objectTemplatesApiBase: '',
};
try {
  // config = cfg;
  Object.assign(config, cfg);
} catch (error) {
  console.error(`[Load Config Error] ${error}`);
}

export default config;
