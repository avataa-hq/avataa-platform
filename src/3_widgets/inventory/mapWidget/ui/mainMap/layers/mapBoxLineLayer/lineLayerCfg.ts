import { LineLayer } from 'react-map-gl';

const linesType = {
  dotted: [0.01, 1.5],
  dashed: [2, 2],
  dotdash: [4, 2, 0, 2],
  twodash: [4, 2, 1, 2],
  longdash: [6, 2],
  solid: [6, 0],
  blank: [0, 0],
};

export const LINE_LAYER_ID = 'line-layer-fiber';
export const LINE_SOURCE_ID = 'line-source-fiber';

export const createLineLayer = (lineColor: string = 'blue'): LineLayer => ({
  id: LINE_LAYER_ID,
  type: 'line',
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
  paint: {
    'line-color': ['case', ['!=', ['get', 'color'], null], ['get', 'color'], lineColor],
    'line-width': ['interpolate', ['linear'], ['zoom'], 12, 2, 14, 6, 16, 8],
    'line-dasharray': [
      'case',
      ['==', ['get', 'line_type'], 'dotted'],
      ['literal', linesType.dotted],
      ['==', ['get', 'line_type'], 'dashed'],
      ['literal', linesType.dashed],
      ['==', ['get', 'line_type'], 'dotdash'],
      ['literal', linesType.dotdash],
      ['==', ['get', 'line_type'], 'twodash'],
      ['literal', linesType.twodash],
      ['==', ['get', 'line_type'], 'longdash'],
      ['literal', linesType.longdash],
      ['==', ['get', 'line_type'], 'solid'],
      ['literal', linesType.solid],
      ['==', ['get', 'line_type'], 'blank'],
      ['literal', linesType.blank],
      ['==', ['get', 'line_type'], null],
      ['literal', linesType.solid],

      ['literal', linesType.solid],
    ],
  },
});
