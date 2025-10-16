import { useCallback } from 'react';
import { INode, registerNode } from '@antv/g6';
import { TABLE_NODE_TYPE } from '6_shared';
import { useDrawTableNode } from './lib';

export const useGetTableNodeBuild = () => {
  const drawTableNode = useDrawTableNode();

  const registerTableNodeBuild = useCallback(() => {
    registerNode(TABLE_NODE_TYPE, {
      draw(cfg, group) {
        return drawTableNode(cfg, group);
      },
      getSize() {
        return [250, 250];
      },
      getAnchorPoints() {
        return [
          [0, 0],
          [1, 0],
        ];
      },
      setState(name, value, item) {
        if (name === 'active') {
          if (!value) item?.update({ activeRowKey: null });

          const itemEdges = (item as INode).getEdges();
          itemEdges.forEach((edge) => edge.refresh());
        }
      },
      // update: undefined,
    });

    return TABLE_NODE_TYPE;
  }, [drawTableNode]);
  return registerTableNodeBuild;
};
