import { useTheme } from '@mui/material';
import { useCallback } from 'react';
import G6, { GraphOptions } from '@antv/g6';
import { alpha } from '@mui/system';
import {
  CustomEdgeConfig,
  DEFAULT_EDGE_TYPE,
  EDGE_EXPAND_ICON_LABEL_OFFSET,
  EDGE_EXPAND_ICON_PADDING,
  EDGE_EXPAND_ICON_RADIUS,
  EDGE_HITBOX_SIZE,
} from '6_shared';
import { useLinkStyleMap } from '../../lib/useLinkStyleMap';
import expandIconSvg from '../expendIcon.svg';

const expandIconGroupId = 'expand-icon-group';

export const useGetDefaultEdgeBuild = () => {
  const theme = useTheme();
  const linkStyleMap = useLinkStyleMap();

  const getDefaultEdgeBuild = useCallback((): GraphOptions['defaultEdge'] => {
    G6.registerEdge(
      DEFAULT_EDGE_TYPE,
      {
        afterDraw(cfg, group) {
          const edgePath = group?.get('children')[0];
          const edgeModel = cfg as CustomEdgeConfig;
          const linkStyle = linkStyleMap[edgeModel.connectionType] ?? linkStyleMap.default;

          edgePath?.attr({
            stroke: linkStyle.stroke,
            lineDash: linkStyle.strokeDasharray,
            lineWidth: linkStyle.strokeWidth,
          });

          if (edgeModel.isExpandable) {
            const middlePoint = edgePath?.getPoint(0.5) ?? { x: 0, y: 0 };

            const expandIconGroup = group?.addGroup({ id: expandIconGroupId });

            expandIconGroup?.addShape('circle', {
              attrs: {
                x: middlePoint.x,
                y: middlePoint.y,
                r: EDGE_EXPAND_ICON_RADIUS,
                fill: theme.palette.primary.main,
                cursor: 'pointer',
              },
              name: 'expand-icon-container',
            });

            expandIconGroup?.addShape('image', {
              attrs: {
                width: EDGE_EXPAND_ICON_RADIUS * 2 - EDGE_EXPAND_ICON_PADDING * 2,
                height: EDGE_EXPAND_ICON_RADIUS * 2 - EDGE_EXPAND_ICON_PADDING * 2,
                x: middlePoint.x - EDGE_EXPAND_ICON_RADIUS + EDGE_EXPAND_ICON_PADDING,
                y: middlePoint.y - EDGE_EXPAND_ICON_RADIUS + EDGE_EXPAND_ICON_PADDING,
                img: expandIconSvg,
                cursor: 'pointer',
              },
              name: 'expand-icon',
            });

            if (edgeModel.connectionType === 'collapsed') {
              // label
              const labelBackground = expandIconGroup?.addShape('rect', {
                attrs: {
                  x: middlePoint.x + EDGE_EXPAND_ICON_LABEL_OFFSET.x,
                  y: middlePoint.y + EDGE_EXPAND_ICON_LABEL_OFFSET.y,
                  width: 30,
                  height: 10,
                  // fill: '#f00',
                  fill: theme.palette.background.default,
                  radius: 4,
                  cursor: 'pointer',
                },
                name: 'node-label-background',
                draggable: true,
              });

              // text
              const labelText = expandIconGroup?.addShape('text', {
                attrs: {
                  text: `${edgeModel.childEdges.length}`,
                  x: middlePoint.x + EDGE_EXPAND_ICON_LABEL_OFFSET.x + 5,
                  y: middlePoint.y + EDGE_EXPAND_ICON_LABEL_OFFSET.y + 5,
                  textAlign: 'center',
                  textBaseline: 'middle',
                  cursor: 'pointer',
                  fontSize: 8,
                  fill: theme.palette.text.primary,
                  fontWeight: 600,
                },
                name: 'node-label-text',
                draggable: true,
              });

              const labelTextBBox = labelText?.getBBox();
              const labelBackgroundWidth = labelTextBBox.width + 5;
              labelBackground?.attr({
                width: labelBackgroundWidth,
                // x: labelBackground.attr('x') - labelBackgroundWidth / 2,
              });
            }

            expandIconGroup?.hide();
          }
        },
        setState(name, value, item) {
          const group = item?.getContainer();
          const expandIconGroup = group?.findById(expandIconGroupId);
          const { isExpandable } = item?.getModel() as CustomEdgeConfig;

          if (name === 'hovered' && isExpandable) {
            if (value) {
              expandIconGroup?.show();
            } else {
              expandIconGroup?.hide();
            }
          }
        },
        // Without this line of code, the expand icon of the edge will be positioned at the top left corner of the canvas
        update: undefined,
      },
      'quadratic',
      // 'line',
    );

    return {
      type: DEFAULT_EDGE_TYPE,
      labelCfg: {
        autoRotate: true,
        refY: 5,
        style: {
          fill: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
          cursor: 'pointer',
        },
      },
      style: {
        stroke: alpha(theme.palette.text.primary, 0.7),
        lineAppendWidth: EDGE_HITBOX_SIZE,
        cursor: 'pointer',
      },
    };
  }, [
    linkStyleMap,
    theme.palette.background.default,
    theme.palette.primary.main,
    theme.palette.text.primary,
  ]);
  return getDefaultEdgeBuild;
};
