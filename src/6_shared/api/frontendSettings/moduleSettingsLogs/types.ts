interface Meta {
  total_count: number;
  page_count: number;
}

interface Element {
  change_time: string;
  user: string;
  domain: string;
  variable: string;
  old_value: string;
  new_value: string;
}

export interface ModuleSettingsLogsResponse {
  meta: Meta;
  elements: Element[];
}

export interface ModuleSettingsLogsSortBy {
  sort_by: string;
  sort_direction: 'asc' | 'desc';
}

export interface GetFilteredModuleSettingsLogsRequest {
  module_names?: string[];
  fields_keys?: string[];
  from_date?: string;
  to_date?: string;
  sort_by?: ModuleSettingsLogsSortBy[];
  limit: number;
  offset: number;
}
