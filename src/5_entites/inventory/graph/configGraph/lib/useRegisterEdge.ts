import G6 from '@antv/g6';
import { useTheme } from '@mui/material';

export const useRegisterEdge = () => {
  const theme = useTheme();
  const edgeType = 'config-graph-custom-edge';

  const registerEdge = () => {
    const edgeStyleMap = {
      enabled: theme.palette.success.main,
      disabled: theme.palette.info.main,
    };

    G6.registerEdge(
      edgeType,
      {
        afterDraw(cfg, group) {
          const shape = group?.get('children')[0];
          const status = cfg?.enabled ? 'enabled' : 'disabled';

          shape.attr({
            lineCap: 'round',
            lineDash: [3, 3],
            stroke: edgeStyleMap[status],
            endArrow: {
              path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
              stroke: 'transparent',
              fill: edgeStyleMap[status],
            },
          });

          const edge = group?.cfg.item;
          const sourceNode = edge?.getSource()?.getModel();
          const targetNode = edge?.getTarget()?.getModel();

          if (sourceNode?.id === targetNode?.id) return;

          const shortenedSourceNodeName =
            sourceNode?.name?.length > 13
              ? `${sourceNode?.name?.slice(0, 13)}...`
              : sourceNode?.name;

          const shortenedTargetNodeName =
            targetNode?.name?.length > 13
              ? `${targetNode?.name?.slice(0, 13)}...`
              : targetNode?.name;

          if (cfg) {
            cfg.label = `${shortenedSourceNodeName} - ${shortenedTargetNodeName}`;
            if (cfg.labelCfg?.style) cfg.labelCfg.style.fill = edgeStyleMap[status];
          }
        },
      },
      'line',
    );

    return edgeType;
  };

  return registerEdge;
};
