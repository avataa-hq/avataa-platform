import { Graph, IEdge, IG6GraphEvent } from '@antv/g6';

export const onGraphEdgeMouseEnter = (event: IG6GraphEvent, graph?: Graph): void => {
  const hoveredEdge = event.item as IEdge;

  if (hoveredEdge) {
    hoveredEdge.setState('hovered', true);
  }
};
