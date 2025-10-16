import { useCallback } from 'react';
import { Graph } from '@antv/x6';
import { useTheme } from '@mui/material';

export const useGetNodeBuild = () => {
  const { palette } = useTheme();

  return useCallback(() => {
    const { main: fill } = palette.primary;

    Graph.registerNode(
      'cable-node',
      {
        inherit: 'rect',
        width: 150,
        height: 150,
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'image',
            selector: 'img',
          },
          {
            tagName: 'rect',
            selector: 'labelBackground',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        attrs: {
          body: {
            stroke: '#8f8f8f',
            strokeWidth: 5,
            fill: '#fff',
            rx: 6,
            ry: 6,
            strokeDasharray: 3,
            filter: {
              name: 'dropShadow',
              args: {
                dx: 6,
                dy: 6,
                blur: 2,
                color: 'rgb(0,0,0)',
                opacity: 0.8,
              },
            },
          },
          labelBackground: {
            fill,
            stroke: fill,
            ref: 'label',
            refWidth: 10,
            refHeight: 10,
            refX: -6,
            refY: -5,
            rx: 6,
            ry: 6,
          },
          label: {
            fill: '#fff',
            fontSize: 14,
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
            pointerEvents: 'none',
          },
        },
      },
      true,
    );
    Graph.registerNode(
      'sleeve-node',
      {
        inherit: 'rect',
        width: 150,
        height: 150,
        attrs: {
          body: {
            stroke: '#000000',
            strokeWidth: 2,
            fill: 'transparent',
          },
        },
      },
      true,
    );
  }, [palette]);
};
