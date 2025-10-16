import { GraphTmoEdge, GraphTmoNode } from '6_shared/api/graph/types';

export const addLevelToNodes = (nodes: GraphTmoNode[], links: GraphTmoEdge[]) => {
  const adjacencyList: Record<string, string[]> = {};
  const nodesMap = nodes.reduce((acc, node) => {
    acc[node.key] = { ...node };
    return acc;
  }, {} as Record<string, GraphTmoNode & { level?: number }>);

  // Populate the adjacency list
  links.forEach((link) => {
    if (!adjacencyList[link.target]) {
      adjacencyList[link.target] = [];
    }
    adjacencyList[link.target].push(link.source);

    if (!adjacencyList[link.source]) {
      adjacencyList[link.source] = [];
    }
  });

  const visited = new Set();

  function dfs(nodeKey: string, level: number) {
    if (visited.has(nodeKey)) {
      return;
    }

    visited.add(nodeKey);

    if (nodesMap[nodeKey]) {
      if (nodesMap[nodeKey].is_grouped) {
        nodesMap[nodeKey].level = level - 0.5;
      } else {
        nodesMap[nodeKey].level = level;
      }
    }

    adjacencyList[nodeKey]?.forEach((neighbor) => {
      dfs(neighbor, level + 1);
    });
  }

  Object.keys(nodesMap).forEach((node) => {
    if (!visited.has(node)) {
      dfs(node, 0);
    }
  });

  return Object.values(nodesMap);
};
