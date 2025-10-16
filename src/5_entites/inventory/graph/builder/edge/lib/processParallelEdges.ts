import { CustomEdgeConfig, DEFAULT_EDGE_TYPE } from '6_shared';
import G6 from '@antv/g6';

export function processParallelEdges(edges: CustomEdgeConfig[], mutate: boolean = false) {
  if (mutate) {
    G6.Util.processParallelEdges(edges, 15, DEFAULT_EDGE_TYPE, DEFAULT_EDGE_TYPE);
    edges.forEach((edge) => {
      edge.type = edge.cachedType ?? DEFAULT_EDGE_TYPE;
    });
    return edges;
  }

  const edgesCopy = edges.map((edge) => ({ ...edge }));

  G6.Util.processParallelEdges(edgesCopy, 15, DEFAULT_EDGE_TYPE, DEFAULT_EDGE_TYPE);

  // G6.Util.processParallelEdges changes all the eges' type to DEFAULT_EDGE_TYPE, so need to change the type back to the original type (from `cachedType`)
  return edgesCopy.map((edge) => ({ ...edge, ...(edge.cachedType && { type: edge.cachedType }) }));
}
