import G6, { IEdge } from '@antv/g6';

import { useTranslate, LINE_NODE_EDGE_TYPE } from '6_shared';

import { useCallback } from 'react';

export const useGetLineNodeEdgeContextMenu = () => {
  const translate = useTranslate();

  const getLineNodeEdgeContextMenu = useCallback(
    ({
      onCollapse,
      onExpand,
    }: {
      onExpand: (item: IEdge) => Promise<void> | void;
      onCollapse: (item: IEdge) => Promise<void> | void;
    }) =>
      new G6.Menu({
        getContent() {
          return `
      <ul class='config-graph__context-menu'>
        <li class='config-graph__context-menu__row enabled' role='expand' >${translate(
          'Expand',
        )}</li>
        <li class='config-graph__context-menu__row enabled' role='collapse'>${translate(
          'Collapse',
        )}</li>
      </ul>`;
        },
        shouldBegin: (e) => e?.item?.getModel().type === LINE_NODE_EDGE_TYPE,
        handleMenuClick: async (target, item) => {
          switch (target.role) {
            case 'expand':
              await onExpand(item as IEdge);
              break;
            case 'collapse':
              await onCollapse(item as IEdge);
              break;
            default:
              break;
          }
        },
        offsetX: 16 + 10,
        offsetY: 0,
        itemTypes: ['edge'],
      }),
    [translate],
  );

  return getLineNodeEdgeContextMenu;
};
