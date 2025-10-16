export function filterDuplicatedEdges<T extends { source?: string; target?: string }>(edges: T[]) {
  const uniqueEdges: T[] = [];

  edges.forEach((edge) => {
    if (
      !uniqueEdges.some(
        (e) =>
          (e.source === edge.source && e.target === edge.target) ||
          (e.target === edge.source && e.source === edge.target),
      )
    ) {
      uniqueEdges.push(edge);
    }
  });

  return uniqueEdges;
}
