import { Graph, IG6GraphEvent, INode } from '@antv/g6';

export const onGraphNodeMouseEnter = (event: IG6GraphEvent, graph?: Graph): void => {
  const hoveredNode = event.item as INode;

  if (hoveredNode) {
    const hoveredNodeModel = hoveredNode.getModel();
    hoveredNode?.toFront();

    if (hoveredNodeModel.type === 'table-node') {
      graph?.removeBehaviors('zoom-canvas', 'default');
    }
  }
};
