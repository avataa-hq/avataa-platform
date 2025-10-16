import { useCallback } from 'react';
import G6 from '@antv/g6';
import { CustomEdgeConfig, LINE_NODE_EDGE_TYPE } from '6_shared';
import { useLinkStyleMap } from '../../lib';

export const useGetLineNodeEdgeBuild = () => {
  const linkStyleMap = useLinkStyleMap();

  const registerLineNodeEdgeBuild = useCallback(() => {
    G6.registerEdge(
      LINE_NODE_EDGE_TYPE,
      {
        afterDraw(cfg, group) {
          const edgePath = group?.get('children')[0];
          const { connectionType, color, lineDash } = cfg as CustomEdgeConfig;
          if (connectionType !== 'line-node') {
            console.error('The edge type is not line-node. The `afterDraw` is not called.', cfg);
            return;
          }

          const linkStyle = linkStyleMap[connectionType] ?? {};
          edgePath?.attr({
            stroke: color ?? linkStyle.stroke,
            lineDash:
              lineDash?.split(',').map((el) => Number.parseInt(el.trim(), 10)) ??
              linkStyle.strokeDasharray,
            lineWidth: linkStyle.strokeWidth ?? 2,
          });
        },
        // Need to set the `update` as undefined, otherwise the edge will be reset to the default style.
        update: undefined,
      },
      'quadratic',
    );

    return LINE_NODE_EDGE_TYPE;
  }, [linkStyleMap]);
  return registerLineNodeEdgeBuild;
};
