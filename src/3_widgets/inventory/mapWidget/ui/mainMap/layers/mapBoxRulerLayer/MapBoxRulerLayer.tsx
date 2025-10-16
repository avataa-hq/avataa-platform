import { Source, Layer } from 'react-map-gl';
import { useTheme } from '@mui/material';
import { RulerSourceDataType } from '../../../../lib/mainMap/Ruler';

const RULE_SOURCE_ID = 'ruler-source';
const LINE_LAYER_ID = 'ruler-line-layer';

interface IProps {
  rulerSourceData?: RulerSourceDataType[];
}

export const MapBoxRulerLayer = ({ rulerSourceData }: IProps) => {
  const { palette } = useTheme();
  return (
    <Source
      id={RULE_SOURCE_ID}
      type="geojson"
      data={{ type: 'FeatureCollection', features: rulerSourceData ?? [] }}
    >
      <Layer
        type="line"
        id={LINE_LAYER_ID}
        source={RULE_SOURCE_ID}
        paint={{ 'line-width': 2, 'line-color': palette.error.main, 'line-dasharray': [5, 2] }}
      />
    </Source>
  );
};
