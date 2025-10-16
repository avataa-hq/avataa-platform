import { useCallback } from 'react';
import { useTheme } from '@mui/material';
import { registerEdge, IEdge } from '@antv/g6';
import {
  CustomEdgeConfig,
  CustomNodeConfig,
  EDGE_EXPAND_ICON_PADDING,
  EDGE_EXPAND_ICON_RADIUS,
  EDGE_HITBOX_SIZE,
  TABLE_NODE_EDGE_TYPE,
} from '6_shared';
import { getTableEdgePoints, useLinkStyleMap } from '../../lib';
import expandIconSvg from '../expendIcon.svg';

const expandIconGroupId = 'expand-icon-group';

export const useGetTableEdgeBuild = () => {
  const theme = useTheme();
  const linkStyleMap = useLinkStyleMap();

  const registerTableEdgeBuild = useCallback(() => {
    registerEdge(
      TABLE_NODE_EDGE_TYPE,
      {
        draw(cfg, group) {
          const edge = group.cfg.item as IEdge;
          const edgeModel = edge.getModel() as CustomEdgeConfig;
          const sourceNode = edge.getSource().getModel() as CustomNodeConfig;
          const targetNode = edge.getTarget().getModel() as CustomNodeConfig;
          const { endPoint, startPoint } = getTableEdgePoints(edge);
          const linkStyle = linkStyleMap[edgeModel.connectionType] ?? {};
          const edgeActiveColor = theme.palette.success.main;

          const isActive =
            sourceNode.activeRowKey === edgeModel.sourceKey ||
            sourceNode.activeRowKey === edgeModel.targetKey ||
            targetNode.activeRowKey === edgeModel.sourceKey ||
            targetNode.activeRowKey === edgeModel.targetKey;

          let path;

          if (sourceNode.id !== targetNode.id) {
            path = [
              ['M', startPoint.x, startPoint.y],
              [
                'C',
                endPoint.x / 3 + (2 / 3) * startPoint.x,
                startPoint.y,
                endPoint.x / 3 + (2 / 3) * startPoint.x,
                endPoint.y,
                endPoint.x,
                endPoint.y,
              ],
            ];
          } else {
            let gap = Math.abs((startPoint.y - endPoint.y) / 3);
            if (startPoint.index === 1) {
              gap = -gap;
            }
            path = [
              ['M', startPoint.x, startPoint.y],
              [
                'C',
                startPoint.x - gap,
                startPoint.y,
                startPoint.x - gap,
                endPoint.y,
                startPoint.x,
                endPoint.y,
              ],
            ];
          }

          const shape = group.addShape('path', {
            attrs: {
              stroke: isActive ? edgeActiveColor : edgeModel.color ?? linkStyle.stroke,
              lineDash:
                (edgeModel.lineDash as string | undefined)
                  ?.split(',')
                  .map((el) => Number.parseInt(el.trim(), 10)) ?? linkStyle.strokeDasharray,
              lineWidth: isActive ? 4 : linkStyle.strokeWidth,
              path,
            },
            name: 'collapsed-edge-path',
          });

          group.addShape('path', {
            attrs: {
              stroke: 'transparent',
              path,
              lineWidth: EDGE_HITBOX_SIZE,
              opacity: 0,
              cursor: 'pointer',
            },
            name: 'collapsed-edge-hitbox',
          });

          // Add label
          if (cfg.label) {
            const edgePath = group?.get('children')[0];
            const labelPosition = edgePath.getPoint(0.5);

            const labelAngle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);

            // Create a group for label
            const labelGroup = group.addGroup();

            // Create a text element for label
            const labelText = labelGroup.addShape('text', {
              attrs: {
                text: cfg.label,
                fill: theme.palette.text.primary,
                fontSize: 8,
                fontWeight: 400,
                cursor: 'pointer',
                x: labelPosition.x,
                y: labelPosition.y,
                textAlign: 'center',
                textBaseline: 'ideographic',
              },
              name: 'node-label-text',
              draggable: true,
            });

            // Calculate rotation angle to make label parallel to the line
            const labelRotation =
              labelAngle > Math.PI / 2 || labelAngle < -Math.PI / 2
                ? labelAngle + Math.PI
                : labelAngle;

            // Rotate label
            labelText.rotateAtStart(labelRotation);

            // Move label along the line
            const labelBox = labelText.getBBox();
            const labelLength = labelBox.width;
            const labelOffsetX = Math.cos(labelAngle) * (labelLength / 2);
            const labelOffsetY = Math.sin(labelAngle) * (labelLength / 2);
            labelText.translate(labelOffsetX, labelOffsetY);
          }

          return shape;
        },
        afterDraw(cfg, group) {
          const edgePath = group?.get('children')[0];
          const { connectionType } = cfg as CustomEdgeConfig;

          if (connectionType === 'collapsed') {
            const middlePoint = edgePath?.getPoint(0.5);

            const expandIconGroup = group?.addGroup({ id: expandIconGroupId });

            expandIconGroup?.addShape('circle', {
              attrs: {
                x: middlePoint?.x,
                y: middlePoint?.y,
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
                x: (middlePoint?.x ?? 0) - EDGE_EXPAND_ICON_RADIUS + EDGE_EXPAND_ICON_PADDING,
                y: (middlePoint?.y ?? 0) - EDGE_EXPAND_ICON_RADIUS + EDGE_EXPAND_ICON_PADDING,
                img: expandIconSvg,
                cursor: 'pointer',
              },
              name: 'expand-icon',
            });

            expandIconGroup?.hide();
          }
        },
        setState(name, value, item) {
          const group = item?.getContainer();
          const { childEdges, type } = item?.getModel() as CustomEdgeConfig;

          if (type !== TABLE_NODE_EDGE_TYPE) {
            console.error('The edge type is not table-node. The `setState` is not called.', item);
            return;
          }

          const { endPoint, startPoint } = getTableEdgePoints(item as IEdge);

          const { x: startX, y: startY } = startPoint;
          const { x: endX, y: endY } = endPoint;

          if (name === 'expanded') {
            const collapsedPath = group?.find(
              (element) => element.get('name') === 'collapsed-edge-path',
            );
            if (value) {
              collapsedPath?.hide();

              const expandIconGroup = group?.findById(expandIconGroupId);
              expandIconGroup?.hide();

              childEdges?.forEach((childEdge, index, childEdgesArr) => {
                const gap = 20;
                const offset = gap * (index - Math.round(childEdgesArr.length / 2));
                const middlePoint = {
                  x: (startX + endX) / 2,
                  y: (startY + endY) / 2,
                };
                const pointToRotate = {
                  x: 0,
                  y: offset,
                };

                const radiansAngle = Math.atan2(endY - startY, endX - startX);
                const rotatedPoint = {
                  x:
                    pointToRotate.x * Math.cos(radiansAngle) -
                    pointToRotate.y * Math.sin(radiansAngle) +
                    middlePoint.x,
                  y:
                    pointToRotate.x * Math.sin(radiansAngle) +
                    pointToRotate.y * Math.cos(radiansAngle) +
                    middlePoint.y,
                };

                const linkStyle = linkStyleMap[childEdge.connection_type] ?? {};
                const path = [
                  ['M', startX, startY],
                  ['Q', rotatedPoint.x, rotatedPoint.y, endX, endY],
                ];

                group?.addShape('path', {
                  attrs: {
                    stroke: linkStyle.stroke,
                    lineDash: linkStyle.strokeDasharray,
                    lineWidth: linkStyle.strokeWidth,
                    path,
                  },
                  name: 'expanded-edge-path',
                });

                group?.addShape('path', {
                  attrs: {
                    stroke: 'transparent',
                    path,
                    lineWidth: EDGE_HITBOX_SIZE,
                    opacity: 0,
                    cursor: 'pointer',
                  },
                  name: 'expanded-edge-hitbox',
                });
              });
            } else {
              collapsedPath?.show();
              item?.update({ childEdges: [] });
              group
                ?.findAll((element) => element.get('name') === 'expanded-edge-path')
                .forEach((expandedEdge) => expandedEdge.remove());
            }
          } else if (name === 'hovered' && !item?.getStates().includes('expanded')) {
            const expandIconGroup = group?.findById(expandIconGroupId);

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
      'extendedEdgeName',
    );

    return TABLE_NODE_EDGE_TYPE;
  }, [
    linkStyleMap,
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.text.primary,
  ]);

  return registerTableEdgeBuild;
};
