import { ConfigType } from '6_shared';
import config from 'config';

const fetchConfigFromVault = async () => {
  const token = config._vaultSecret;
  const url = config._vaultURL;

  try {
    const response = await fetch(`${url}/v1/kv/data/platform/web`, {
      method: 'GET',
      headers: {
        'X-Vault-Token': token,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    return await response.json();
  } catch (error) {
    throw new Error('There was a problem with the fetch operation:', error);
  }
};

export async function updateConfigFromVault() {
  try {
    const vaultResponse = await fetchConfigFromVault();
    const vaultConfig = vaultResponse.data.data;

    const updatedConfig: Partial<ConfigType> = {
      _clickhouseUrl: vaultConfig.REACT_APP_CLICKHOUSE_API_BASE,
      _clickhouseName: vaultConfig.REACT_APP_CLICKHOUSE_USERNAME,
      _clickhousePass: vaultConfig.REACT_APP_CLICKHOUSE_PASSWORD,
      _clickhouseCorsDisable: vaultConfig.REACT_APP_CLICKHOUSE_CORS_DISABLE,
      _apiBaseSearchV2: vaultConfig.REACT_APP_SEARCH_API_BASE_V2,
      _apiBaseSearchV3: vaultConfig.REACT_APP_SEARCH_API_BASE_V3,
      _apiBase8000: vaultConfig.REACT_APP_INVENTORY_API_BASE,
      _apiBase8001: vaultConfig.REACT_APP_GEODATA_API_BASE,
      _apiBase8001v2: vaultConfig.REACT_APP_GEODATA_API_BASE_V2,
      _apiBase8100: vaultConfig.REACT_APP_HIERARCHY_API_BASE,
      _apiBase8101: vaultConfig.REACT_APP_DOCUMENTS_API_BASE,
      _apiBase8003: vaultConfig.REACT_APP_DATAFLOW_API_BASE,
      _apiBase8004: vaultConfig.REACT_APP_PLANNING_API_BASE,
      _apiBase8004FrontendSettings: vaultConfig.REACT_APP_FRONTEND_SETTINGS_API_BASE,
      _apiBase8005: vaultConfig.REACT_APP_PROJECT_API_BASE,
      _apiBaseBuilding: vaultConfig.REACT_APP_BUILDING_API_BASE_V1,
      _apiBaseDataflowV2: vaultConfig.REACT_APP_DATAFLOW_API_BASE_V2,
      _dataflowV3ApiBase: vaultConfig.REACT_APP_DATAFLOW_API_BASE_V3,
      _dataviewApiBase: vaultConfig.REACT_APP_DATAVIEW_API_BASE,
      _externalDashboardsApiBase: vaultConfig.REACT_APP_POWER_BI_API_BASE,
      _mapApiKey: vaultConfig.REACT_APP_GOOGLE_API_KEY,
      _mapArcGisApiKey: vaultConfig.REACT_APP_ARCGIS_API_KEY,
      _keycloakUrl: vaultConfig.REACT_APP_KEYCLOAK_URL,
      _keycloakRealm: vaultConfig.REACT_APP_KEYCLOAK_REALM,
      _keycloakClientId: vaultConfig.REACT_APP_KEYCLOAK_CLIENT_ID,
      _keycloakTestUrl: vaultConfig.REACT_APP_KEYCLOAK_TEST_URL,
      _table_Data_Grid_License_Key: vaultConfig.REACT_APP_TABLE_DATA_GRID_LICENSE_KEY,
      _mapboxApiAccessToken: vaultConfig.REACT_APP_MAPBOX_API_ACCESS_TOKEN,
      _processGroupApiBase: vaultConfig.REACT_APP_PROCESS_GROUP_API_BASE,
      _assistantApiBase: vaultConfig.REACT_APP_ASSISTANT_API_BASE,

      _camundaOperate: vaultConfig.REACT_APP_CAMUNDA_API,
      _camundaClientId: vaultConfig.REACT_APP_CAMUNDA_CLIENT_ID,
      _camundaRealm: vaultConfig.REACT_APP_CAMUNDA_REALM,
      _camundaUsername: vaultConfig.REACT_APP_CAMUNDA_USERNAME,
      _camundaPassword: vaultConfig.REACT_APP_CAMUNDA_PASSWORD,
      _camundaZeebeClient: vaultConfig.REACT_APP_ZEEBE_CLIENT_API_BASE,

      _airflowApiBase: vaultConfig.REACT_APP_AIRFLOW_API,
      _airflowUsername: vaultConfig.REACT_APP_AIRFLOW_USERNAME,
      _airflowPassword: vaultConfig.REACT_APP_AIRFLOW_PASSWORD,

      _availableLocales: vaultConfig.REACT_APP_AVAILABLE_LOCALES,

      _commentsApiBase: vaultConfig.REACT_APP_COMMENTS_API_BASE,
      _capacityApiBase: vaultConfig.REACT_APP_CAPACITY_API_BASE,
      _securityMiddlewareApi: vaultConfig.REACT_APP_SECURITY_MIDDLEWARE_API_BASE,

      _logoLightLarge: vaultConfig.REACT_APP_LOGO_LIGHT_LARGE,
      _logoLightSmall: vaultConfig.REACT_APP_LOGO_LIGHT_SMALL,
      _favicon: vaultConfig.REACT_APP_FAVICON,
      _pageTitle: vaultConfig.REACT_APP_PAGE_TITLE,

      _theme: vaultConfig.REACT_APP_THEME,

      processMapBaseUrl: vaultConfig.REACT_APP_PROCESS_MAP_BASE_URL,
      processDashboardBaseUrl: vaultConfig.REACT_APP_PROCESS_DASHBOARD_BASE_URL,
      processRuleBaseUrl: vaultConfig.REACT_APP_PROCESS_RULE_BASE_URL,

      _liveUpdateHTTPLink: vaultConfig.REACT_APP_LIVE_UPDATE_BASE,
      _liveUpdateWebsocketLink: vaultConfig.REACT_APP_LIVE_UPDATE_GRAPHQL_WEBSOCKET_BASE,

      _matomoBaseUrl: vaultConfig.REACT_APP_MATOMO_BASE_URL,
      _matomoSiteId: vaultConfig.REACT_APP_MATOMO_SITE_ID,

      _kafkaUI: vaultConfig.REACT_APP_KAFKA_UI,
      _kibanaUI: vaultConfig.REACT_APP_KIBANA_UI,
      _elasticSearchUI: vaultConfig.REACT_APP_ELASTICSEARCH_UI,
      _camundaOperateUI: vaultConfig.REACT_APP_CAMUNDA_OPERATE_UI,
      _camundaTasklistUI: vaultConfig.REACT_APP_CAMUNDA_TASKLIST_UI,
      _camundaOptimizeUI: vaultConfig.REACT_APP_CAMUNDA_OPTIMIZE_UI,
      _camundaIdentityUI: vaultConfig.REACT_APP_CAMUNDA_IDENTITY_UI,
      _apacheAirflowIU: vaultConfig.REACT_APP_APACHE_AIRFLOW_UI,
      _apacheSupersetUI: vaultConfig.REACT_APP_APACHE_SUPERSET_UI,
      _grafanaUI: vaultConfig.REACT_APP_GRAFANA_UI,
      _uptimeKumaUI: vaultConfig.REACT_APP_UPTIME_KUMA_UI,
      _nextcloud: vaultConfig.REACT_APP_NEXTCLOUD_UI,
      _openprojectUI: vaultConfig.REACT_APP_OPENPROJECT_UI,
      _testrailUI: vaultConfig.REACT_APP_TESTRAIL_UI,
      _minioUI: vaultConfig.REACT_APP_MINIO_UI,
      _pgAdminUI: vaultConfig.REACT_APP_PGADMIN_UI,
      _graphAssistantBase: vaultConfig.REACT_APP_GRAPH_ASSISTANT_BASE,
      _objectTemplatesApiBase: vaultConfig.REACT_APP_OBJECT_TEMPLATES_API_BASE,
    };

    return updatedConfig;
  } catch (error) {
    return {};
  }
}
