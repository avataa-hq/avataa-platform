import { Graph, IG6GraphEvent } from '@antv/g6';

export const onGraphNodeMouseLeave = (event: IG6GraphEvent, graph?: Graph) => {
  const hoveredNode = event.item?.getModel();
  if (!hoveredNode) return;

  if (hoveredNode.type === 'table-node') {
    graph?.addBehaviors('zoom-canvas', 'default');
  }
};
