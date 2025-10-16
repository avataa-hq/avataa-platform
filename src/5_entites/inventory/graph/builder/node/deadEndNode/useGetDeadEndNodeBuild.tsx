import { useTheme } from '@mui/material';
import { useCallback } from 'react';
import G6, { IShape } from '@antv/g6';
import { MuiIcons } from '6_shared/ui/icons/MuiIcons';
import { renderToString } from 'react-dom/server';
import { DEADEND_NODE_TYPE } from '6_shared';

export const useGetDeadEndNodeBuild = () => {
  const { palette } = useTheme();
  return useCallback(() => {
    const { main: fill } = palette.error;
    G6.registerNode(
      DEADEND_NODE_TYPE,
      {
        draw(cfg, group) {
          // main node
          const keyShape: IShape = group.addShape('circle', {
            attrs: { r: 5, fill },
            name: 'node-keyShape-2',
            draggable: true,
          });

          // shadow node
          group.addShape('circle', {
            attrs: { r: 10, fill },
            name: 'shadow-node-2',
            draggable: true,
          });

          const IconComponent = MuiIcons.CloseOutlined;

          if (IconComponent)
            group.addShape('image', {
              attrs: {
                x: -5,
                y: -5,
                width: 10,
                height: 10,
                cursor: 'pointer',
                img: `data:image/svg+xml;base64,${window.btoa(
                  renderToString(
                    <IconComponent
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        fill: palette.getContrastText(fill),
                        aspectRatio: 1,
                      }}
                    />,
                  ),
                )}`,
              },
              name: 'node-icon-2',
              draggable: true,
            });

          return keyShape;
        },
      },
      'circle',
    );
  }, [palette]);
};
