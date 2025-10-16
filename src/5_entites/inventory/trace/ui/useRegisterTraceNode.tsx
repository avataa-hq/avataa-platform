import G6 from '@antv/g6';
import { useTheme } from '@mui/material';
import { renderToString } from 'react-dom/server';

import { MuiIcons } from '6_shared/ui/icons/MuiIcons';
import { useCallback } from 'react';

const NODE_TYPE = 'trace-node';

export const useRegisterTraceNode = () => {
  const theme = useTheme();
  const registerNode = useCallback(() => {
    const { main: fill } = theme.palette.primary;

    G6.registerNode(
      NODE_TYPE,
      {
        afterDraw(cfg, group) {
          const nodeConfig = cfg as any;

          const IconComponent = nodeConfig.muiIcon
            ? MuiIcons[nodeConfig.muiIcon as keyof typeof MuiIcons]
            : null;

          if (IconComponent)
            group?.addShape('image', {
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
                        fill: theme.palette.getContrastText(nodeConfig.color ?? fill),
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
        },
        update: undefined,
      },
      'circle',
    );

    return NODE_TYPE;
  }, [theme.palette]);

  return registerNode;
};
