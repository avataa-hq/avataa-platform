import { useCallback } from 'react';
import G6, { INode } from '@antv/g6';
import { useTranslate } from '6_shared';

export const useGetNodeContextMenu = () => {
  const translate = useTranslate();

  const getNodeContextMenu = useCallback(
    ({
      onCollapse,
      onExpand,
      onShowNeighbors,
      onFindAPath,
    }: {
      onExpand: (item: INode) => Promise<void> | void;
      onCollapse: (item: INode) => Promise<void> | void;
      onShowNeighbors: (item: INode) => Promise<void> | void;
      onFindAPath: (item: INode) => Promise<void> | void;
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
        <li class='config-graph__context-menu__row enabled' role='show_neighbors'>${translate(
          'Show neighbors',
        )}</li>
        <li class='config-graph__context-menu__row enabled' role='find_a_path'>${translate(
          'Find a path',
        )}</li>
      </ul>`;
        },
        handleMenuClick: async (target, item) => {
          switch (target.role) {
            case 'expand':
              await onExpand(item as INode);
              break;
            case 'collapse':
              await onCollapse(item as INode);
              break;
            case 'show_neighbors':
              await onShowNeighbors(item as INode);
              break;
            case 'find_a_path':
              await onFindAPath(item as INode);
              break;
            default:
              break;
          }
        },
        offsetX: 16 + 10,
        offsetY: 0,
        itemTypes: ['node'],
      }),
    [translate],
  );

  return getNodeContextMenu;
};
