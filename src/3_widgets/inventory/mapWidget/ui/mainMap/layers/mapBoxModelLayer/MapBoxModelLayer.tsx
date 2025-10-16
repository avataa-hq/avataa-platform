import { GeoJSONPoint, hexToRGB } from '6_shared';
import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';
import { ScatterplotLayer } from '@deck.gl/layers/typed';
import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed';
import { GLTFLoader } from '@loaders.gl/gltf';
import { Position } from 'deck.gl/typed';
import { useControl } from 'react-map-gl';
import { ISelectedInventoryObject } from '6_shared/models/inventoryMapWidget/types';

const DeckGLOverlay = (props: MapboxOverlayProps) => {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
};

interface IProps {
  dataPoints?: GeoJSONPoint<any>['features'];
  onClick?: (clickedObject: ISelectedInventoryObject) => void;
  selectedObject?: ISelectedInventoryObject | null;
}
export const MapBoxModelLayer = ({ dataPoints, onClick, selectedObject }: IProps) => {
  return (
    <DeckGLOverlay
      layers={
        dataPoints && [
          new ScatterplotLayer({
            id: 'scatterplot-point-layer',
            data: dataPoints,
            getPosition: (d) => d.geometry.coordinates as Position,
            getFillColor: (d: any) => hexToRGB(d.properties.color ?? '#056cbe'),
            getRadius: 3,
            radiusMinPixels: 10,
            radiusMaxPixels: 10,
            pickable: true,
            onClick: (info) => {
              const [longitude, latitude] = info.coordinate as [number, number];
              onClick?.({
                position: { latitude, longitude },
                object: info.object.properties,
              });
            },
          }),
          ...dataPoints.map(
            (feature) =>
              new ScenegraphLayer({
                id: `${feature.properties.id}-scenegraph-point-layer`,
                data: [feature],
                getPosition: feature.geometry.coordinates as Position,
                getOrientation: [0, 0, 90],
                getScale: [1, 1, 1],
                getTranslation: [0, 0, 0],
                getColor:
                  selectedObject?.object.id === feature.properties.id
                    ? hexToRGB('#36be05')
                    : hexToRGB(feature.properties.color ?? '#056cbe'),
                scenegraph: feature.properties.model,
                sizeMinPixels: 10,
                sizeMaxPixels: 50,
                sizeScale: 3,
                loaders: [GLTFLoader],
                _lighting: 'pbr',
                pickable: true,
                onClick: (info) => {
                  const [longitude, latitude] = info.coordinate as [number, number];
                  onClick?.({
                    position: { latitude, longitude },
                    object: info.object.properties,
                  });
                },
              }),
          ),
        ]
      }
    />
  );
};
