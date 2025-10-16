import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGetLayerContent } from '5_entites';
import {
  GeoJSONLineString,
  GeoJSONMultiPolygon,
  GeoJSONPoint,
  GeoJSONPolygon,
  IInventoryObjectModel,
  useLayersSlice,
} from '6_shared';
import { convertShpToGeoJson } from './convertShpToGeoJson';
import { convertKmzToGeoJson } from './convertKmzToGeoJson';
import { convertKmlToGeoJson } from './convertKmlToGeoJson';

interface IProps {
  inventoryDataPoints: GeoJSONPoint<IInventoryObjectModel> | undefined;
  inventoryDataMultiPolygon: GeoJSONMultiPolygon<IInventoryObjectModel> | undefined;
  inventoryDataPolygon: GeoJSONPolygon<IInventoryObjectModel> | undefined;
  inventoryDataLineString: GeoJSONLineString<IInventoryObjectModel> | undefined;
}

export const useMapLayersControl = ({
  inventoryDataPoints,
  inventoryDataMultiPolygon,
  inventoryDataPolygon,
  inventoryDataLineString,
}: IProps) => {
  const [newPolygonFeatures, setNewPolygonFeatures] = useState<GeoJSON.Feature<GeoJSON.Polygon>[]>(
    [],
  );
  const [newMultiPolygonFeatures, setNewMultiPolygonFeatures] = useState<
    GeoJSON.Feature<GeoJSON.MultiPolygon>[]
  >([]);
  const [newPointFeatures, setNewPointFeatures] = useState<GeoJSON.Feature<GeoJSON.Point>[]>([]);
  const [newLineFeatures, setNewLineFeatures] = useState<GeoJSON.Feature<GeoJSON.LineString>[]>([]);
  const [tileServers, setTileServers] = useState<{ id: number; url: string }[]>([]);

  const { selectedLayers } = useLayersSlice();

  const { getLayerContent } = useGetLayerContent({});

  useEffect(() => {
    const fetchLayerContent = async () => {
      try {
        const allFeatures = await Promise.all(
          selectedLayers.map(async (layer) => {
            const layerContent =
              layer.name.endsWith('.kmz') || layer.name.endsWith('.shp')
                ? ''
                : await getLayerContent({ layer_id: layer.id }).unwrap();

            let parsedContent;

            if (layer.name.endsWith('.geojson')) {
              parsedContent = JSON.parse(layerContent);
            }

            if (layer.name.endsWith('.kml')) {
              parsedContent = convertKmlToGeoJson(layerContent);
            }

            if (layer.name.endsWith('.kmz')) {
              parsedContent = await convertKmzToGeoJson(layer.file_link);
            }

            if (layer.name.endsWith('.shp')) {
              parsedContent = await convertShpToGeoJson(layer.file_link);
            }

            if (layerContent?.startsWith('http')) {
              setTileServers((prev) => {
                if (prev.some((item) => item.id === layer.id)) {
                  return prev;
                }
                return [...prev, { id: layer.id, url: layerContent }];
              });
            }

            return parsedContent?.features || [];
          }),
        );

        setTileServers((prev) => {
          if (selectedLayers.length === 0) {
            return [];
          }

          const filtered = prev.filter((tile) =>
            selectedLayers.some((layer) => layer.id === tile.id),
          );

          return filtered.length > 0 ? filtered : [];
        });

        const combinedFeatures = allFeatures.flat();

        const { pointFeatures, multiPolygonFeatures, polygonFeatures, lineFeatures } =
          combinedFeatures.reduce(
            (acc, feature) => {
              if (feature.geometry?.type === 'Point') {
                const newFeature = {
                  ...feature,
                  id: feature?.id ?? uuidv4(),
                  properties: {
                    id: uuidv4(),
                  },
                };
                acc.pointFeatures.push(newFeature);
              }
              if (feature.geometry?.type === 'MultiPolygon') {
                acc.multiPolygonFeatures.push(feature);
              }
              if (feature.geometry?.type === 'Polygon') {
                acc.polygonFeatures.push(feature);
              }
              if (feature.geometry?.type === 'LineString') {
                acc.lineFeatures.push(feature);
              }
              return acc;
            },
            { pointFeatures: [], multiPolygonFeatures: [], polygonFeatures: [], lineFeatures: [] },
          );

        setNewPointFeatures(pointFeatures);
        setNewMultiPolygonFeatures(multiPolygonFeatures);
        setNewPolygonFeatures(polygonFeatures);
        setNewLineFeatures(lineFeatures);
      } catch (error) {
        console.error('Error fetching layer content:', error);
      }
    };

    fetchLayerContent();
  }, [
    selectedLayers,
    getLayerContent,
    inventoryDataPolygon,
    inventoryDataPoints,
    inventoryDataLineString,
    inventoryDataMultiPolygon,
  ]);

  const dataPoints = useMemo(() => {
    const newFeatures = inventoryDataPoints
      ? inventoryDataPoints.features.concat(
          newPointFeatures as GeoJSONPoint<IInventoryObjectModel>['features'],
        )
      : (newPointFeatures as GeoJSONPoint<IInventoryObjectModel>['features']);

    const newDataPoints: GeoJSONPoint<IInventoryObjectModel> = {
      ...(inventoryDataPoints ?? {}),
      features: newFeatures,
      type: 'FeatureCollection',
    };

    return newDataPoints;
  }, [inventoryDataPoints, newPointFeatures]);

  const dataMultiPolygon = useMemo(() => {
    const newFeatures = inventoryDataMultiPolygon
      ? inventoryDataMultiPolygon.features.concat(
          newMultiPolygonFeatures as GeoJSONMultiPolygon<IInventoryObjectModel>['features'],
        )
      : (newMultiPolygonFeatures as GeoJSONMultiPolygon<IInventoryObjectModel>['features']);

    const newDataMultiPolygon: GeoJSONMultiPolygon<IInventoryObjectModel> = {
      ...(inventoryDataMultiPolygon ?? {}),
      features: newFeatures,
      type: 'FeatureCollection',
    };

    return newDataMultiPolygon;
  }, [inventoryDataMultiPolygon, newMultiPolygonFeatures]);

  const dataPolygon = useMemo(() => {
    const newFeatures = inventoryDataPolygon
      ? inventoryDataPolygon.features.concat(
          newPolygonFeatures as GeoJSONPolygon<IInventoryObjectModel>['features'],
        )
      : (newPolygonFeatures as GeoJSONPolygon<IInventoryObjectModel>['features']);

    const newDataPolygon: GeoJSONPolygon<IInventoryObjectModel> = {
      ...(inventoryDataPolygon ?? {}),
      features: newFeatures,
      type: 'FeatureCollection',
    };

    return newDataPolygon;
  }, [inventoryDataPolygon, newPolygonFeatures]);

  const dataLineString = useMemo(() => {
    const newFeatures = inventoryDataLineString
      ? inventoryDataLineString.features.concat(
          newLineFeatures as GeoJSONLineString<IInventoryObjectModel>['features'],
        )
      : (newLineFeatures as GeoJSONLineString<IInventoryObjectModel>['features']);

    const newDataLineString: GeoJSONLineString<IInventoryObjectModel> = {
      ...(inventoryDataLineString ?? {}),
      features: newFeatures,
      type: 'FeatureCollection',
    };

    return newDataLineString;
  }, [inventoryDataLineString, newLineFeatures]);

  return { dataPoints, dataMultiPolygon, dataPolygon, dataLineString, tileServers };
};
