import { Layer, Source } from 'react-map-gl';

interface IProps {
  id: number;
  url: string;
}

export const MapBoxTileLayer = ({ id, url }: IProps) => {
  const sourceId = `source-id-${id}`;
  const layerId = `layer-id-${id}`;

  return (
    <Source id={sourceId} type="raster" tiles={[url]} tileSize={256}>
      <Layer id={layerId} type="raster" source={sourceId} />
    </Source>
  );
};
