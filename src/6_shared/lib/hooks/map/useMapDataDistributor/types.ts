import { FeatureCollection, LineString, MultiPolygon, Point, Polygon, MultiPoint } from 'geojson';
import type { IInventoryGeometryModel } from '../../../../types';

export interface GeneralMapDataModel {
  [key: string]: any;

  geometry?: IInventoryGeometryModel | null;
  latitude?: number | null;
  longitude?: number | null;
}

export type GeoJSONPoint<T extends GeneralMapDataModel> = FeatureCollection<Point, T>;
export type GeoJSONMultiPoint<T extends GeneralMapDataModel> = FeatureCollection<MultiPoint, T>;
export type GeoJSONLineString<T extends GeneralMapDataModel> = FeatureCollection<LineString, T>;
export type GeoJSONPolygon<T extends GeneralMapDataModel> = FeatureCollection<Polygon, T>;
export type GeoJSONMultiPolygon<T extends GeneralMapDataModel> = FeatureCollection<MultiPolygon, T>;

export interface IDistributorDataModel<T extends GeneralMapDataModel> {
  dataPoints?: GeoJSONPoint<T>;
  dataMultiPoints?: GeoJSONMultiPoint<T>;
  dataLineString?: GeoJSONLineString<T>;
  dataPolygon?: GeoJSONPolygon<T>;
  dataMultiPolygon?: GeoJSONMultiPolygon<T>;
}
