export interface ISearchResponseModel {
  type: string;
  query: string[];
  features: ISearchFeatureModel[];
  attribution: string;
}

interface ISearchFeatureModel {
  id: string;
  type: string;
  geometry: Geometry;
  properties: Properties;
  // place_type: string[];
  // relevance: number;
  // properties: Properties;
  // text: string;
  // place_name: string;
  // center: number[];
  // context: Context[];
  // matching_text?: string;
  // matching_place_name?: string;
  // bbox?: number[];
}

interface Region {
  mapbox_id: string;
  name: string;
  wikidata_id: string;
  region_code: string;
  region_code_full: string;
}

interface Country {
  mapbox_id: string;
  name: string;
  country_code: string;
  country_code_alpha_3: string;
  wikidata_id: string;
}

interface Place {
  mapbox_id: string;
  name: string;
  wikidata_id: string;
}

interface Geometry {
  coordinates: number[];
  type: string;
}

interface Context {
  region: Region;
  country: Country;
  place: Place;
  // id: string;
  // mapbox_id: string;
  // text: string;
  // wikidata?: string;
  // short_code?: string;
}

interface Properties {
  mapbox_id: string;
  feature_type: string;
  full_address: string;
  name: string;
  name_preferred: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  bbox: [number, number, number, number]; // [min_lon, min_lat, max_lon, max_lat]
  context: Context;
  // foursquare?: string;
  // landmark?: boolean;
  // category?: string;
  // address?: string;
  // mapbox_id?: string;
  // wikidata?: string;
  // maki?: string;
}

interface IGeometry {
  coordinates: number[] | null;
  type: string | null;
}

export interface IOption {
  id: string | number;
  tmo_name?: string;
  name: string;
  geometry: IGeometry;
  group: string;
}

export type GroupName = 'Objects' | 'Parameters' | 'Geographic';
