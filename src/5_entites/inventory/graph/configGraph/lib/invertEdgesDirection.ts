import { GraphTmoEdge } from '6_shared/api/graph/types';

export const invertEdgesDirection = (edges: GraphTmoEdge[]) => {
  return edges.map((edge) => ({
    ...edge,
    source: edge.target,
    target: edge.source,
  }));
};
