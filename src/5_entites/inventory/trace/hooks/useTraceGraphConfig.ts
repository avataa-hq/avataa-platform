import { GraphOptions } from '@antv/g6';
import { alpha, useTheme } from '@mui/material';

import { NODE_PADDING, NODE_SIZE } from '../model/contants';
import { useRegisterTraceNode } from '../ui/useRegisterTraceNode';

export const useTraceGraphConfig = (
  nodePadding?: number,
): Omit<GraphOptions, 'container' | 'width' | 'height'> => {
  const theme = useTheme();
  const nodeType = useRegisterTraceNode()();

  return {
    linkCenter: true,
    layout: {
      type: 'grid',
      cols: 1,
      sortBy: 'degree',
      preventOverlap: true,
      preventNodeOverlap: true,
      nodeSize: NODE_SIZE,
      preventOverlapPadding: nodePadding ?? NODE_PADDING,
    },
    defaultNode: {
      type: nodeType,
      style: {
        r: 16,
        stroke: alpha(theme.palette.primary.main, 0.3),
        lineWidth: 20,
        fill: theme.palette.primary.main,
        cursor: 'pointer',
      },
      labelCfg: {
        position: 'left',
        offset: 24,
        ResizeObserverSize: 100,
        style: {
          fill: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
          fontWeight: 'bold',
        },
      },
    },
    defaultEdge: {
      style: {
        stroke: alpha(theme.palette.text.primary, 0.8),
        cursor: 'pointer',
      },
      labelCfg: {
        autoRotate: true,
        refY: 10,
        style: {
          fill: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
          fontWeight: 'bold',
          cursor: 'pointer',
        },
      },
    },
  };
};
