export interface ModuleSettingsType {
  module_name: string;
  settings: ModuleSettingsValuesType;
  dirty?: boolean;
}

type ModuleSettingsValuesType = {
  'Map Settings'?: MapSettings;
  Hierarchies?: Hierarchies;
  'KPI Settings'?: Record<string, KPISetting[]>;
  [key: string]: any;
};

interface MapSettings {
  longitude: string | number;
  latitude: string | number;
  zoom: string | number;
  minZoom: string | number;
}

interface Hierarchies {
  Default: Hierarchy;
  All: Hierarchy[];
}

interface Hierarchy {
  id: string | number;
  name: string;
}

export interface KPISetting {
  name: string;
  tmo_id: string;
  level_id: string;
  main_kpis: KPIGroup;
  additional_kpis: KPIGroup;
  external_level?: number;
}

interface KPIGroup {
  [kpiName: string]: KPI;
}

interface KPI {
  ID: string;
  min: string;
  max: string;
  'Granularity ID': string;
  decimals: string;
  direction: 'up' | 'down';
}

const mapSettings: MapSettings = {
  longitude: '51.184533',
  latitude: '25.338812',
  zoom: '8.35',
  minZoom: '6',
};

const numericMapSettings: Partial<MapSettings> = {};

Object.keys(mapSettings).forEach((key) => {
  const typedKey = key as keyof MapSettings;
  const value = mapSettings[typedKey];

  numericMapSettings[typedKey] = typeof value === 'string' ? parseFloat(value) : value;
});
