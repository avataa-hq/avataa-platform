import { GeoJSONMultiPolygon, GeoJSONPolygon, hexToRGB } from '6_shared';
import { useEffect } from 'react';
import { GoogleMapsOverlay } from '@deck.gl/google-maps/typed';
import { PolygonLayer as DeckPolygonLayer } from '@deck.gl/layers/typed';
import { useMap } from '@vis.gl/react-google-maps';
import { STREET_VIEW_MAP_ID } from '6_shared/models/inventoryMapWidget/constants';

interface IProps {
  polygonData?: GeoJSONPolygon<any>;
  multiPolygonData?: GeoJSONMultiPolygon<any>;
}
export const PolygonLayer = ({ polygonData, multiPolygonData }: IProps) => {
  const map = useMap(STREET_VIEW_MAP_ID);

  useEffect(() => {
    const deckOverlay = new GoogleMapsOverlay({
      layers: [
        new DeckPolygonLayer({
          data: polygonData?.features,
          getPolygon: (d) => d.geometry.coordinates,
          getFillColor: (d) => hexToRGB(d.properties.color ?? '#0059ff'),
          getLineColor: (d) => hexToRGB(d.properties.color ?? '#0059ff'),
          opacity: 0.1,
          filled: true,
          stroked: true,
          lineWidthMinPixels: 1,
          lineWidthMaxPixels: 3,
          getLineWidth: 1,
          pickable: true,
        }),
        new DeckPolygonLayer({
          data: multiPolygonData?.features,
          getPolygon: (d) => d.geometry.coordinates,
          getFillColor: (d) => hexToRGB(d.properties.color ?? '#4482f7'),
          getLineColor: (d) => hexToRGB(d.properties.color ?? '#3579ff'),
          opacity: 0.1,
          filled: true,
          stroked: true,
          lineWidthMinPixels: 1,
          lineWidthMaxPixels: 3,
          getLineWidth: 1,
          pickable: true,
        }),
      ],
    });
    if (map) deckOverlay.setMap(map);

    return () => {
      deckOverlay.finalize();
    };
  }, [polygonData, map, multiPolygonData]);

  return null;
};
