import { useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';
import { GeoJSONLineString, hexToRGB, ILatitudeLongitude } from '6_shared';
import { GoogleMapsOverlay } from '@deck.gl/google-maps/typed';
import { PathLayer } from '@deck.gl/layers/typed';
import { STREET_VIEW_MAP_ID } from '6_shared/models/inventoryMapWidget/constants';

interface IProps {
  lineStringData?: GeoJSONLineString<any>;
  onLineClick?: (position: ILatitudeLongitude) => void;
}
export const LineLayers = ({ lineStringData, onLineClick }: IProps) => {
  const map = useMap(STREET_VIEW_MAP_ID);

  useEffect(() => {
    const deckOverlay = new GoogleMapsOverlay({
      layers: [
        new PathLayer({
          data: lineStringData?.features,
          getColor: (d: any) => hexToRGB(d.properties.color ?? '#0059ff'),
          widthMaxPixels: 7,
          widthMinPixels: 3,
          getPath: (d: any) => d.geometry.coordinates,
          pickable: true,
          onClick: (info) => {
            if (info.coordinate) {
              onLineClick?.({
                latitude: info.coordinate[1],
                longitude: info.coordinate[0],
              });
            }
          },
        }),
      ],
    });
    if (map) deckOverlay.setMap(map);

    return () => {
      deckOverlay.finalize();
    };
  }, [lineStringData, map]);

  return null;
};
