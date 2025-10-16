# Avataa Platform

## Environment variables

```toml
REACT_APP_AIRFLOW_API=<airflow_external_protocol>://<airflow_external_host>:<airflow_external_port>/api/v1/
REACT_APP_AIRFLOW_PASSWORD=<airflow_read_password>
REACT_APP_AIRFLOW_USERNAME=<airflow_read_user>
REACT_APP_ALLOWED_SEARCH_COUNTRIES=
REACT_APP_APACHE_AIRFLOW_UI=<airflow_external_protocol>://<airflow_external_host>:<airflow_external_port>/
REACT_APP_APACHE_SUPERSET_UI=<superset_external_protocol>://<superset_external_host>:<superset_external_port>/
REACT_APP_ARCGIS_API_KEY=<arcgis_api_key>
REACT_APP_ASSISTANT_API_BASE=wss://<ai_external_host>:<ai_external_port><ai_prefix_v1>
REACT_APP_AVAILABLE_LOCALES=<enUS/deDE/ukUA/ruRU>
REACT_APP_BUILDING_API_BASE_V1=<capex_fixed_external_protocol>://<capex_fixed_external_host>:<capex_fixed_external_port><capex_fixed_prefix_v1>
REACT_APP_CAMUNDA_API=<camunda_operate_external_protocol://<camunda_operate_external_host>:<camunda_operate_external_port>/v1/
REACT_APP_CAMUNDA_CLIENT_ID=<keycloak_camunda_platform_client>
REACT_APP_CAMUNDA_IDENTITY_UI=<camunda_identity_external_protocol>://<camunda_identity_external_host>:<camunda_identity_external_port>/
REACT_APP_CAMUNDA_OPERATE_UI=<camunda_operate_external_protocol>://<camunda_operate_external_host>:<camunda_operate_external_port>/
REACT_APP_CAMUNDA_OPTIMIZE_UI=<camunda_optimize_external_protocol>://<camunda_optimize_external_host>:<camunda_optimize_external_port>/
REACT_APP_CAMUNDA_PASSWORD=<camunda_read_password>
REACT_APP_CAMUNDA_REALM=<keycloak_camunda_realm>
REACT_APP_CAMUNDA_TASKLIST_GRAPHQL_API=<camunda_tasklist_external_protocol>://<camunda_tasklist_external_host>:<camunda_tasklist_external_port>/graphql
REACT_APP_CAMUNDA_TASKLIST_UI=<camunda_tasklist_external_protocol>://<camunda_tasklist_external_host>:<camunda_tasklist_external_port>/
REACT_APP_CAMUNDA_USERNAME=<camunda_read_user>
REACT_APP_CAPACITY_API_BASE=<tn_capacity_external_protocol>://<tn_capacity_external_host>:<tn_capacity_external_port><tn_capacity_prefix_v4>
REACT_APP_COMMENTS_API_BASE=<inventory_comments_external_protocol>://<inventory_comments_external_host>:<inventory_comments_external_port><inventory_comments_prefix_v1>
REACT_APP_DATAFLOW_API_BASE_V2=<dataflow_external_protocol>://<dataflow_external_host>:<dataflow_external_port><dataflow_prefix_v2>
REACT_APP_DATAFLOW_API_BASE_V3=<dataflow_external_protocol>://<dataflow_external_host>:<dataflow_external_port><dataflow_prefix_v3>
REACT_APP_DATAVIEW_API_BASE=<dataview_manager_external_protocol>://<dataview_manager_external_host>:<dataview_manager_external_port><dataview_prefix_v1>
REACT_APP_DISABLE_TIMEZONE_ADJUSTMENT=<true/false>
REACT_APP_DOCUMENTS_API_BASE=<documents_external_protocol>://<documents_external_host>:<documents_external_port><documents_prefix_v1>
REACT_APP_ELASTICSEARCH_UI=<kibana_external_protocol>://<kibana_external_host>:<kibana_external_port>/
REACT_APP_ENV=development
REACT_APP_EVENT_MANAGER_API_BASE=<event_manager_external_protocol>://<event_manager_external_host>:<event_manager_external_port><event_manager_prefix_v1>
REACT_APP_FAVICON=<favicon_url_or_path>
REACT_APP_FRONTEND_SETTINGS_API_BASE=<frontend_settings_external_protocol>://<frontend_settings_external_host>:<frontend_settings_external_port><frontend_settings_prefix_v1>
REACT_APP_GEODATA_API_BASE_V2=<generator_external_protocol>://<generator_external_host>:<generator_external_port><generator_prefix_v2>
REACT_APP_GOOGLE_API_KEY=<google_api_key>
REACT_APP_GRAFANA_UI=<grafana_external_protocol>://<grafana_external_host>:<grafana_external_port>/
REACT_APP_GRAPH_API_BASE=<graph_external_protocol>://<graph_external_host>:<graph_external_port><graph_prefix_v1>
REACT_APP_GRAPH_ASSISTANT_BASE=<ai_external_protocol>://<ai_external_host>:<ai_external_port><ai_prefix_v1>
REACT_APP_HIERARCHY_API_BASE=<hierarchy_external_protocol>://<hierarchy_external_host>:<hierarchy_external_port><hierarchy_prefix_v1>
REACT_APP_INITIAL_LATITUDE=<initial_latitude>
REACT_APP_INITIAL_LONGITUDE=<initial_longitude>
REACT_APP_INVENTORY_API_BASE=<inventory_external_protocol>://<inventory_external_host>:<inventory_external_port><inventory_prefix_v1>
REACT_APP_KAFKA_UI=<kafka_ui_external_protocol>://<kafka_ui_external_host>:<kafka_ui_external_port>/
REACT_APP_KEYCLOAK_CLIENT_ID=<keycloak_platform_client>
REACT_APP_KEYCLOAK_REALM=avataa
REACT_APP_KEYCLOAK_URL=<keycloak_external_protocol>://<keycloak_external_host>:<keycloak_external_port>/
REACT_APP_LAYERS_API_BASE=<layers_external_protocol>://<layers_external_host>:<layers_external_port><layers_prefix_v1>
REACT_APP_LIVE_UPDATE_API_BASE=<live_update_external_protocol>://<live_update_external_host>:<live_update_external_port><live_update_prefix_v1>
REACT_APP_LIVE_UPDATE_GRAPHQL_WEBSOCKET_BASE=<live_update_external_protocol>://<live_update_external_host>:<live_update_external_port><live_update_prefix_graphql_v1>
REACT_APP_LOGO_LIGHT_LARGE=<large_logo_url_or_path>
REACT_APP_LOGO_LIGHT_SMALL=<small_logo_url_or_path>
REACT_APP_MAPBOX_API_ACCESS_TOKEN=<mapbox_api_access_token>
REACT_APP_MINIO_UI=<minio_external_protocol>://<minio_external_host>:<minio_external_port>/
REACT_APP_NEXTCLOUD_UI=<nextcloud_external_protocol>://<nextcloud_external_host>:<nextcloud_external_port>/
REACT_APP_OBJECT_STATE_API_BASE=<object_state_external_protocol>://<object_state_external_host>:<object_state_external_port><object_state_prefix_v1>
REACT_APP_OPENPROJECT_UI=<openproject_external_protocol>://<openproject_external_host>:<openproject_external_port>/
REACT_APP_PAGE_TITLE=<platform_page_title>
REACT_APP_PGADMIN_UI=<pgadmin_external_protocol>://<pgadmin_external_host>:<pgadmin_external_port>/
REACT_APP_PLANNING_API_BASE=<planning_external_protocol>://<planning_external_host>:<planning_external_port><planning_prefix_v1>
REACT_APP_POWER_BI_API_BASE=<power_bi_external_protocol>://<power_bi_external_host>:<power_bi_external_port><power_bi_prefix_v1>
REACT_APP_PROCESS_DASHBOARD_BASE_URL=<process_dashboard_base_url>
REACT_APP_PROCESS_GROUP_API_BASE=<group_external_protocol>://<group_external_host>:<group_external_port><group_prefix_v1>
REACT_APP_PROCESS_MAP_BASE_URL=<process_map_base_url>
REACT_APP_PROCESS_RULE_BASE_URL=<process_rule_base_url>
REACT_APP_PROJECT_API_BASE=<project_external_protocol>://<project_external_host>:<project_external_port><projects_prefix_v1>
REACT_APP_SEARCH_API_BASE=<search_external_protocol>://<search_external_host>:<search_external_port><search_prefix_v1>
REACT_APP_SEARCH_API_BASE_V2=<search_external_protocol>://<search_external_host>:<search_external_port><search_prefix_v2>
REACT_APP_SEARCH_API_BASE_V3=<search_external_protocol>://<search_external_host>:<search_external_port><search_prefix_v3>
REACT_APP_SECURITY_MIDDLEWARE_API_BASE=<security_middleware_external_protocol>://<security_middleware_external_host>:<security_middleware_external_port><security_middleware_prefix_v1>
REACT_APP_SUMMARY_API_BASE=<summary_external_protocol>://<summary_external_host>:<summary_external_port><summary_prefix_v1>
REACT_APP_TABLE_DATA_GRID_LICENSE_KEY=<table_data_grid_license_key>
REACT_APP_UPTIME_KUMA_UI=<uptime_kuma_external_protocol>://<uptime_kuma_external_host>:<uptime_kuma_external_port>/
REACT_APP_ZEEBE_CLIENT_API_BASE=<zeebe_client_external_protocol>://<zeebe_client_external_host>:<zeebe_client_external_port><zeebe_prefix_v1>
WDS_SOCKET_PORT=0
```

### Explanation

- `*_external_port` - not needed if equals `443`, usually need when protocol is `http`;
- `REACT_APP_AIRFLOW_USERNAME` - `Airflow` user with read permissions;
- `REACT_APP_CAMUNDA_REALM` - `Keycloak Camunda realm` where Camunda store user and client information, e.g `camunda-platform`;
- `REACT_APP_CAMUNDA_CLIENT_ID` - `Keycloak` client id for mobile platforms (Workflows and Inventory Details (?)), e.g `unity`;
- `REACT_APP_KEYCLOAK_CLIENT_ID` - e.g `web`;
- `REACT_APP_INITIAL_LATITUDE` -  `latitude` for the specific region, centerened on map when application is started;
- `REACT_APP_INITIAL_LONGITUDE` -  `longitude` for the specific region, centerened on map when application is started;
- `REACT_APP_CAMUNDA_PASSWORD` - `Camunda` password of user with read permissions;
- `REACT_APP_CAMUNDA_USERNAME` - `Camunda` username of user with read permissions;

keys:

- `REACT_APP_ARCGIS_API_KEY` - `Arcgis` api key;
- `REACT_APP_GOOGLE_API_KEY` - `Google` api key;
- `REACT_APP_MAPBOX_API_ACCESS_TOKEN` - `Mapbox` api access token;
- `REACT_APP_TABLE_DATA_GRID_LICENSE_KEY` - `Table data grid` license key;

title and logos:

- `REACT_APP_PAGE_TITLE` - title of browser tab, f.- `Avataa`;
- `REACT_APP_FAVICON` - external url or local path, path should be in directory `/home/node/public` of container, then value will f.- `logo/favicon.ico`;
- `REACT_APP_LOGO_LIGHT_LARGE` - external url or local path for `large` icon, path should be in directory `/home/node/public` of container, then value will be f.- `logo/large_logo.png`;
- `REACT_APP_LOGO_LIGHT_SMALL` - external url or local path for `small` icon, path should be in directory `/home/node/public` of container, then value will be f.- `logo/small_logo.png`;


extra-services URLs: 

- `REACT_APP_APACHE_SUPERSET_UI` - e.g `https://superset.domain.com`;
- `REACT_APP_CAMUNDA_IDENTITY_UI` - e.g `https://camunda-identity.domain.com/`;
- `REACT_APP_CAMUNDA_OPERATE_UI` - e.g `https://camunda-operate.domain.com/`;
- `REACT_APP_CAMUNDA_OPTIMIZE_UI` - e.g `https://camunda-optimize.domain.com/`;
- `REACT_APP_CAMUNDA_TASKLIST_UI` - e.g `https://camunda-tasklist.domain.com/`;
- `REACT_APP_ELASTICSEARCH_UI` - e.g `https://kibana.domain.com/`;
- `REACT_APP_GRAFANA_UI` - e.g `https://grafana.domain.com/`;
- `REACT_APP_KAFKA_UI` - e.g `https://kafka.domain.com/`;
- `REACT_APP_MINIO_UI` - e.g `https://minio.domain.com/`;
- `REACT_APP_NEXTCLOUD_UI` - e.g `https://nextcloud.domain.com/`;
- `REACT_APP_OPENPROJECT_UI` - e.g `https://openproject.domain.com/`;
- `REACT_APP_UPTIME_KUMA_UI` - e.g `https://kuma.domain.com/`;
- `REACT_APP_PGADMIN_UI` - e.g `https://pgadmin.domain.com/`;

prefixes of microservices: 

- `ai_prefix_v1` - `v1 prefix` of microservice `ai`, e.g `/api/ai/v1/`;
- `capex_fixed_prefix_v1` - `v1 prefix` of microservice `capex-fixed`, e.g `/api/capex_fixed/v1/`;
- `tn_capacity_prefix_v4` - `v4 prefix` of microservice `tn-capacity`, e.g `/api/tn_capacity/v4/`;
- `inventory_comments_prefix_v1` - `v1 prefix` of microservice `inventory-comments`, e.g `/api/inventory_comments/v1/`;
- `dataflow_prefix_v1` - `v1 prefix` of microservice `dataflow`, e.g `/api/dataflow/v1/`;
- `dataflow_prefix_v2` - `v2 prefix` of microservice `dataflow`, e.g `/api/dataflow/v2/`;
- `dataflow_prefix_v3` - `v3 prefix` of microservice `dataflow`, e.g `/api/dataflow/v3/`;
- `dataview_prefix_v1` - `v1 prefix` of microservice `dataview`, e.g `/api/dataview/v1/`;
- `documents_prefix_v1` - `v1 prefix` of microservice `documents`, e.g `/api/documents/v1/`;
- `frontend_settings_prefix_v1` - `v1 prefix` of microservice `frontend_settings`, e.g `/api/frontend_settings/v1/`;
- `generator_prefix_v2` - `v2 prefix` of microservice `generator`, e.g `/api/generator/v2/`;
- `graph_prefix_v1` - `v1 prefix` of microservice `graph`, e.g `/api/graph/v1/`;
- `hierarchy_prefix_v1` - `v1 prefix` of microservice `hierarchy`, e.g `/api/hierarchy/v1/`;
- `inventory_prefix_v1` - `v1 prefix` of microservice `inventory`, e.g `/api/inventory/v1/`;
- `live_update_prefix_v1` - `v1 prefix` of microservice `live_update`, e.g `/api/live_update/v1/`;
- `live_update_prefix_graphql_v1` - `v1 prefix` of microservice `live_update`, e.g `/api/live_update/v1/graphql`;
- `object_state_prefix_v1` - `v1 prefix` of microservice `object_state`, e.g `/api/object_state/v1/`;
- `planning_prefix_v1` - `v1 prefix` of microservice `planning`, e.g `/api/planning/v1/`;
- `power_bi_prefix_v1` - `v1 prefix` of microservice `power-bi`, e.g `/api/power_bi/v1/`;
- `group_prefix_v1` - `v1 prefix` of microservice `group`, e.g `/api/group/v1/`;
- `projects_prefix_v1` - `v1 prefix` of microservice `projects`, e.g `/api/projects/v1/`;
- `search_prefix_v1` - `v1 prefix` of microservice `search`, e.g `/api/search/v1/`;
- `search_prefix_v2` - `v2 prefix` of microservice `search`, e.g `/api/search/v2/`;
- `security_middleware_prefix_v1` - `v1 prefix` of microservice `security-middleware`, e.g `/api/security_middleware/v1/`;
- `summary_prefix_v1` - `v1 prefix` of microservice `summary`, e.g `/api/summary/v1/`;
- `zeebe_prefix_v1` - `v1 prefix` of microservice `zeebe`, e.g `/api/zeebe/v1/`;

#### Compose

- `REGISTRY_URL` - Docker regitry URL, e.g. `harbor.avataa.dev`
- `PLATFORM_PROJECT_NAME` - Docker regitry project Docker image can be downloaded from, e.g. `avataa`


## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
