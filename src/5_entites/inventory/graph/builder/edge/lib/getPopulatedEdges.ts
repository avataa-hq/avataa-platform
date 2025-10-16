import {
  CustomEdgeConfig,
  CustomNodeConfig,
  DEFAULT_EDGE_TYPE,
  DefaultEdgeConfig,
  Graph3000DataEdge,
  TABLE_NODE_EDGE_TYPE,
} from '6_shared';

const getFilteredEdgesWithUniqueKey = (edges: Graph3000DataEdge[]) => {
  const uniqueSet = new Set<string>();

  return edges.filter((connection) => {
    // Создаем строку для каждой пары, сортируя source и target
    const { key } = connection;

    if (uniqueSet.has(key)) {
      return false; // Если такая связка уже есть, не добавляем
    }
    uniqueSet.add(key);
    return true; // Добавляем уникальную связку
  });
};

export const getPopulatedEdges = (edges: Graph3000DataEdge[], nodes: CustomNodeConfig[]) => {
  const uniqueEdges = getFilteredEdgesWithUniqueKey(edges);

  // Эжди которые связывают ноды, НЕ табличные
  const defaultEdges: DefaultEdgeConfig[] = [];
  // Эжди которые связывают ноды, ТОЛЬКО табличные
  const tableEdges: CustomEdgeConfig[] = [];

  uniqueEdges.forEach((edge) => {
    const sNodeRow = nodes.find((n) => n.tableRows?.some((tr) => tr.key === edge.source));
    const tNodeRow = nodes.find((n) => n.tableRows?.some((tr) => tr.key === edge.target));

    if (sNodeRow || tNodeRow) {
      const source = sNodeRow?.key ?? edge.source;
      const target = tNodeRow?.key ?? edge.target;
      tableEdges.push({
        ...edge,
        id: edge.key,
        key: edge.key,
        source,
        target,
        isVirtual: edge.virtual,
        sourceKey: edge.source,
        targetKey: edge.target,
        connectionType: edge.connection_type,
        isExpandable: edge.connection_type === 'geometry_line',
        type: TABLE_NODE_EDGE_TYPE,
        cachedType: TABLE_NODE_EDGE_TYPE,
        childEdges: [],
        visible: edge.visible || true,
      });
    }

    defaultEdges.push({
      ...edge,
      id: edge.key,
      key: edge.key,
      source_object: edge.source_object,
      type: DEFAULT_EDGE_TYPE,
      source: edge.source,
      target: edge.target,
      isVirtual: edge.virtual,
      connectionType: edge.connection_type,
      isExpandable: edge.connection_type === 'geometry_line',
      visible: edge.visible || true,
    });
  });

  return { tableEdges, defaultEdges };
};
