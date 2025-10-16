import { useTheme } from '@mui/material';
import { useCallback } from 'react';
import G6, { IShape } from '@antv/g6';
import { CABEL_NODE_TYPE, CustomNodeConfig } from '6_shared';

export const useGetCabelNodeBuild = () => {
  const { palette } = useTheme();
  return useCallback(() => {
    const { main: fill } = palette.primary;

    G6.registerNode(
      CABEL_NODE_TYPE,
      {
        draw(cfg, group) {
          const nodeConfig = cfg as CustomNodeConfig;

          const nodeWidth = 200;
          const nodeHeight = 200;

          // main node
          const keyShape: IShape = group.addShape('rect', {
            attrs: {
              width: nodeWidth,
              height: nodeHeight,
              fill: palette.background.default,
              stroke: 'black',
              lineDash: [2, 2],
            },
            name: 'node-keyShape',
            draggable: true,
          });

          // text
          const labelText = group.addShape('text', {
            attrs: {
              text: `${nodeConfig.name}`,
              x: nodeWidth / 2,
              y: nodeHeight / 2,
              textAlign: 'center',
              textBaseline: 'middle',
              cursor: 'pointer',
              fontSize: 12,
              fill: palette.common.white,
              fontWeight: 600,
            },
            name: 'node-label-text',
            draggable: true,
          });

          const labelTextBBox = labelText.getBBox();
          const labelBackgroundWidth = labelTextBBox.width + 20;
          const labelBackgroundHeight = labelTextBBox.height + 10;

          // label background
          group.addShape('rect', {
            attrs: {
              x: (nodeWidth - labelBackgroundWidth) / 2,
              y: (nodeHeight - labelBackgroundHeight) / 2,
              width: labelBackgroundWidth,
              height: labelBackgroundHeight,
              fill,
              radius: 4,
              cursor: 'pointer',
            },
            name: 'node-label-background',
            draggable: true,
          });

          // put text in front of background
          labelText.toFront();

          return keyShape;
        },

        update: undefined,
      },
      'rect',
    );
  }, [palette]);
};
