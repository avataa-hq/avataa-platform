import { Graph, IEdge, IG6GraphEvent } from '@antv/g6';

export const onGraphEdgeMouseLeave = (event: IG6GraphEvent, graph?: Graph) => {
  const hoveredEdge = event.item as IEdge;
  if (hoveredEdge) {
    hoveredEdge.setState('hovered', false);
  }
};
