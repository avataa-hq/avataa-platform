import { DataflowDiagramNode, Link } from '6_shared';

export const getNodesWithNewLinks = (nodes: DataflowDiagramNode[], newLinks: Link[]) => {
  const nodesHashMap = nodes.reduce<Record<number, DataflowDiagramNode>>(
    (accumulator, node) => ({ ...accumulator, [node.id]: node }),
    {},
  );

  newLinks.forEach((link) => {
    const sourceNode = nodesHashMap[link.source];
    const targetNode = nodesHashMap[link.target];

    if (!sourceNode || !targetNode) return;

    nodesHashMap[link.source] = {
      ...sourceNode,
      connections: {
        ...sourceNode.connections,
        to: [...sourceNode.connections.to, link.target],
      },
    };

    nodesHashMap[link.target] = {
      ...targetNode,
      connections: {
        ...targetNode.connections,
        from: [...targetNode.connections.from, link.source],
      },
    };
  });

  return Object.values(nodesHashMap);
};
