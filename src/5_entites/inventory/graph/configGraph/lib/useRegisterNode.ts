import G6, { IShape, ModelConfig } from '@antv/g6';
import { useTheme } from '@mui/material';

export const useRegisterNode = () => {
  const nodeType = 'config-graph-custom-node';
  const theme = useTheme();
  const registerNode = <N extends ModelConfig = ModelConfig>(
    params: {
      nodeLabelKey?: keyof N;
      rootNodeKey: string;
    } | void,
  ) => {
    const nodeStyleMap = {
      startNode: theme.palette.success.main,
      enabled: theme.palette.success.main,
      disabled: theme.palette.info.main,
    };

    G6.registerNode(
      nodeType,
      {
        draw(cfg, group) {
          const isStartNode = params?.rootNodeKey === cfg?.key;
          const status = cfg?.enabled ? 'enabled' : 'disabled';
          const fill = nodeStyleMap[status];
          // const fill = nodeStyleMap[isStartNode ? 'startNode' : status];

          // main node
          const keyShape: IShape = group.addShape('circle', {
            attrs: { r: 14, fill, cursor: 'pointer' },
            name: 'aggregated-node-keyShape',
            draggable: true,
          });

          // shadow node
          group.addShape('circle', {
            attrs: { r: 25, fill, opacity: 0.2, cursor: 'pointer' },
            name: 'shadow-node',
            draggable: true,
          });

          // node hover
          group.addShape('circle', {
            attrs: { r: 16, fill, cursor: 'pointer' },
            name: 'node-hover',
            visible: false,
            draggable: true,
          });

          // node-focus
          group.addShape('circle', {
            attrs: { r: 16, fill, cursor: 'pointer' },
            name: 'node-focus',
            visible: false,
            draggable: true,
          });

          if (cfg[params?.nodeLabelKey as string]) {
            // label
            const labelOffsetY = 30;

            const labelBackground = group.addShape('rect', {
              attrs: {
                x: -35,
                y: labelOffsetY,
                width: 70,
                height: 20,
                fill: isStartNode ? theme.palette.success.main : theme.palette.background.default,
                radius: 4,
                cursor: 'pointer',
              },
              name: 'node-label',
              draggable: true,
            });

            // text
            const labelText = group.addShape('text', {
              attrs: {
                text: cfg[params?.nodeLabelKey as string],
                x: 0,
                y: 40,
                textAlign: 'center',
                textBaseline: 'middle',
                cursor: 'pointer',
                fontSize: 12,
                fill: isStartNode ? theme.palette.success.contrastText : theme.palette.text.primary,
                fontWeight: 600,
              },
              name: 'count-shape',
              draggable: true,
            });

            const labelTextBBox = labelText.getBBox();
            const labelBackgroundWidth = labelTextBBox.width + 20;
            labelBackground.attr({ width: labelBackgroundWidth, x: -labelBackgroundWidth / 2 });
          }

          return keyShape;
        },
        setState: (name, value, item) => {
          if (!item) return;

          const group = item.get('group');

          if (name === 'layoutEnd' && value) {
            const labelShape = group.find((e: any) => e.get('name') === 'text-shape');

            if (labelShape) labelShape.set('visible', true);
          } else if (name === 'hover') {
            if (item.hasState('focus')) return;

            const nodeHover = group.find((e: any) => e.get('name') === 'node-hover');

            if (value) nodeHover.show();
            else nodeHover.hide();
          } else if (name === 'focus') {
            const nodeFocus = group.find((e: any) => e.get('name') === 'node-focus');

            if (value) nodeFocus.show();
            else nodeFocus.hide();
          }
        },
        update: undefined,
      },
      'node',
    );

    return nodeType;
  };

  return registerNode;
};
