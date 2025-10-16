import type { IInventoryGeometryModel, IInventoryObjectModel } from '../../../types';

export const getCorrectInventoryObjectGeometry = (
  objectGeometry: IInventoryGeometryModel,
): GeoJSON.Feature<
  GeoJSON.Point | GeoJSON.LineString | GeoJSON.MultiPolygon | GeoJSON.Polygon | GeoJSON.MultiPoint
> | null => {
  if (objectGeometry.path && typeof objectGeometry.path === 'string')
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: JSON.parse(objectGeometry.path) as GeoJSON.LineString['coordinates'],
      },
      properties: {},
    };

  if (objectGeometry.coordinates) {
    if (
      (
        objectGeometry.coordinates as unknown as GeoJSON.MultiPolygon['coordinates']
      )?.[0]?.[0]?.[0]?.[0]
    )
      return {
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: objectGeometry.coordinates as unknown as GeoJSON.MultiPolygon['coordinates'],
        },
        properties: {},
      };

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: objectGeometry.coordinates as unknown as GeoJSON.Polygon['coordinates'],
      },
      properties: {},
    };
  }

  return { type: 'Feature', geometry: objectGeometry.path as GeoJSON.Polygon, properties: {} };
};

export const getInventoryObjectWithCorrectGeometry = (inventoryObject: IInventoryObjectModel) => {
  if (inventoryObject.geometry) {
    const geoJsonGeometry = getCorrectInventoryObjectGeometry(inventoryObject.geometry);
    if (geoJsonGeometry) {
      return {
        ...inventoryObject,
        geometry: {
          path: geoJsonGeometry.geometry,
          ...(inventoryObject.geometry?.path_length && {
            path_length: inventoryObject.geometry.path_length,
          }),
        },
      };
    }
  }

  return inventoryObject;
};
