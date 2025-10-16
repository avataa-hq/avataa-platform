import type { GeneralMapDataModel, ILatitudeLongitude } from '6_shared';
import { Position } from 'geojson';
import type {
  GeoJSONLineString,
  GeoJSONMultiPolygon,
  GeoJSONPoint,
  GeoJSONPolygon,
  GeoJSONMultiPoint,
} from './types';

interface IProps<T extends GeneralMapDataModel> {
  mapData: T[];
}

export const workerMapDataDistributor = () => {
  const isObjectEmpty = (obj: any) => Object.keys(obj).length === 0;
  const isObjectGeometry = (obj: any) =>
    obj.geometry && !isObjectEmpty(obj.geometry) && obj.geometry_type !== 'point';

  const createPointsGeoJSON = <T extends GeneralMapDataModel>(
    coords: ILatitudeLongitude,
    properties: T,
  ): GeoJSONPoint<T>['features'][number] => {
    return {
      id: properties.id || null,
      type: 'Feature',
      properties,
      geometry: { type: 'Point', coordinates: [coords.longitude, coords.latitude] },
    };
  };
  const createMultiPointsGeoJSON = <T extends GeneralMapDataModel>(
    coords: Position[],
    properties: T,
  ): GeoJSONMultiPoint<T>['features'][number] => {
    return {
      id: properties.id || null,
      type: 'Feature',
      properties,
      geometry: { type: 'MultiPoint', coordinates: coords },
    };
  };
  const createLineStringGeoJSON = <T extends GeneralMapDataModel>(
    coords: Position[],
    properties: T,
  ): GeoJSONLineString<T>['features'][number] => {
    return {
      id: properties.id || null,
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
      properties,
    };
  };

  const createPolygonGeoJSON = <T extends GeneralMapDataModel>(
    coords: Position[][],
    properties: T,
  ): GeoJSONPolygon<T>['features'][number] => {
    return {
      id: properties.id || null,
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: coords },
      properties,
    };
  };

  const createMultiPolygonGeoJSON = <T extends GeneralMapDataModel>(
    coords: Position[][][],
    properties: T,
  ): GeoJSONMultiPolygon<T>['features'][number] => {
    return {
      id: properties.id || null,
      type: 'Feature',
      geometry: { type: 'MultiPolygon', coordinates: coords },
      properties,
    };
  };

  const getGeoJSONFromInventoryObjects = <T extends GeneralMapDataModel>(data: T[]) => {
    const dataPoints: GeoJSONPoint<T> = { type: 'FeatureCollection', features: [] };
    const dataMultiPoints: GeoJSONMultiPoint<T> = { type: 'FeatureCollection', features: [] };
    const dataLineString: GeoJSONLineString<T> = { type: 'FeatureCollection', features: [] };
    const dataPolygon: GeoJSONPolygon<T> = { type: 'FeatureCollection', features: [] };
    const dataMultiPolygon: GeoJSONMultiPolygon<T> = { type: 'FeatureCollection', features: [] };

    data.forEach((object) => {
      const { geometry, longitude, latitude, geometry_type } = object;
      if (!isObjectGeometry(object) && longitude && latitude) {
        dataPoints.features.push(createPointsGeoJSON({ latitude, longitude }, object));
      }
      if (geometry && isObjectGeometry(object)) {
        const { coordinates, type } = geometry.path;
        if (type === 'LineString' && coordinates.length) {
          dataLineString.features.push(createLineStringGeoJSON(coordinates as Position[], object));
        }
        if (type === 'Polygon' && coordinates.length) {
          dataPolygon.features.push(createPolygonGeoJSON(coordinates as Position[][], object));
        }
        if (type === 'MultiPolygon' && coordinates.length) {
          dataMultiPolygon.features.push(
            createMultiPolygonGeoJSON(coordinates as Position[][][], object),
          );
        }
        if (
          // @ts-ignore
          (type === 'MultiPoint' || type === 'multipoint') &&
          geometry_type === 'line' &&
          coordinates.length
        ) {
          const line = {
            ...object,
            geometry: { path: { type: 'LineString', coordinates } },
            latitude: null,
            longitude: null,
            model: null,
          };
          dataLineString.features.push(createLineStringGeoJSON(coordinates as Position[], line));
        }
      }
    });

    return { dataPoints, dataLineString, dataPolygon, dataMultiPolygon, dataMultiPoints };
  };

  addEventListener('message', <T extends GeneralMapDataModel>(event: MessageEvent<IProps<T>>) => {
    const { mapData } = event.data;

    const { dataPoints, dataLineString, dataPolygon, dataMultiPolygon, dataMultiPoints } =
      getGeoJSONFromInventoryObjects(mapData);

    postMessage({ dataPoints, dataLineString, dataPolygon, dataMultiPolygon, dataMultiPoints });
  });
};
