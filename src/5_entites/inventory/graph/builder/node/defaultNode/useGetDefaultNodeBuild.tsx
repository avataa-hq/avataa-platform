import { useTheme } from '@mui/material';
import { useCallback } from 'react';
import G6, { GraphOptions, IShape } from '@antv/g6';
import { MuiIcons } from '6_shared/ui/icons/MuiIcons';
import { renderToString } from 'react-dom/server';
import { CustomNodeConfig, DEFAULT_NODE_SIZE, DEFAULT_NODE_TYPE } from '6_shared';

export const useGetDefaultNodeBuild = () => {
  const { palette } = useTheme();
  return useCallback((): GraphOptions['defaultNode'] => {
    const { main: fill } = palette.primary;
    const { main: activeFill } = palette.success;

    G6.registerNode(
      DEFAULT_NODE_TYPE,
      {
        draw(cfg, group) {
          const nodeConfig = cfg as CustomNodeConfig;

          // main node
          const keyShape: IShape = group.addShape('circle', {
            attrs: {
              r: 14,
              fill: nodeConfig.color ?? fill,
              cursor: 'pointer',
            },
            name: 'node-keyShape',
            draggable: true,
          });

          // shadow node
          group.addShape('circle', {
            attrs: {
              r: 25,
              fill: nodeConfig.color ?? fill,
              opacity: 0.2,
              cursor: 'pointer',
            },
            name: 'shadow-node',
            draggable: true,
          });

          // node hover
          group.addShape('circle', {
            attrs: {
              r: 16,
              fill: nodeConfig.color ?? fill,
              cursor: 'pointer',
            },
            name: 'node-hover',
            visible: false,
            draggable: true,
          });

          // node-focus
          group.addShape('circle', {
            attrs: {
              r: 16,
              fill: nodeConfig.color ?? fill,
              cursor: 'pointer',
            },
            name: 'node-focus',
            visible: false,
            draggable: true,
          });

          const IconComponent = nodeConfig.muiIcon
            ? MuiIcons[nodeConfig.muiIcon as keyof typeof MuiIcons]
            : null;

          if (IconComponent)
            group.addShape('image', {
              attrs: {
                x: -10,
                y: -10,
                width: 20,
                height: 20,
                cursor: 'pointer',
                img: `data:image/svg+xml;base64,${window.btoa(
                  renderToString(
                    <IconComponent
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        fill: palette.getContrastText(nodeConfig.color ?? fill),
                        padding: '5px',
                        aspectRatio: 1,
                      }}
                    />,
                  ),
                )}`,
              },
              name: 'node-icon',
              draggable: true,
            });

          // label
          const labelBackground = group.addShape('rect', {
            attrs: {
              x: -35,
              y: 30,
              width: 70,
              height: 20,
              fill: palette.background.default,
              radius: 4,
              cursor: 'pointer',
            },
            name: 'node-label-background',
            draggable: true,
          });

          // text
          const labelText = group.addShape('text', {
            attrs: {
              text: `${nodeConfig.name}`,
              x: 0,
              y: 40,
              textAlign: 'center',
              textBaseline: 'middle',
              cursor: 'pointer',
              fontSize: 12,
              fill: palette.text.primary,
              fontWeight: 600,
            },
            name: 'node-label-text',
            draggable: true,
          });

          const labelTextBBox = labelText.getBBox();
          const labelBackgroundWidth = labelTextBBox.width + 20;
          labelBackground.attr({ width: labelBackgroundWidth, x: -labelBackgroundWidth / 2 });

          return keyShape;
        },
        setState(name, value, item) {
          const group = item?.getContainer();
          const nodeModel = item?.getModel() as CustomNodeConfig;
          if (name === 'active') {
            const keyShape = group?.find((element) => element.get('name') === 'node-keyShape');
            const shadowNode = group?.find((element) => element.get('name') === 'shadow-node');
            const nodeHover = group?.find((element) => element.get('name') === 'node-hover');
            const nodeFocus = group?.find((element) => element.get('name') === 'node-focus');
            const labelText = group?.find((element) => element.get('name') === 'node-label-text');
            const labelBackground = group?.find(
              (element) => element.get('name') === 'node-label-background',
            );
            if (value) {
              keyShape?.attr({ fill: activeFill });
              shadowNode?.attr({ fill: activeFill });
              nodeHover?.attr({ fill: activeFill });
              nodeFocus?.attr({ fill: activeFill });
              labelBackground?.attr({ fill: activeFill });
              labelText?.attr({ fill: palette.getContrastText(activeFill) });
            } else {
              keyShape?.attr({ fill: nodeModel?.color ?? fill });
              shadowNode?.attr({ fill: nodeModel?.color ?? fill });
              nodeHover?.attr({ fill: nodeModel?.color ?? fill });
              nodeFocus?.attr({ fill: nodeModel?.color ?? fill });
              labelBackground?.attr({ fill: palette.background.default });
              labelText?.attr({ fill: palette.text.primary });
            }
          }
        },
        update: undefined,
      },
      'circle',
    );

    return {
      type: DEFAULT_NODE_TYPE,
      size: DEFAULT_NODE_SIZE,
      anchorPoints: [[0.5, 0.5]],
    };
  }, [palette]);
};
