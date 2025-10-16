import { Subset } from 'types';
import { DataflowDiagramNode, patchObject } from '6_shared';

export const getNodesWithUpdatedNode = (
  nodes: DataflowDiagramNode[],
  nodeId: number,
  updatedNode: Subset<DataflowDiagramNode>,
): DataflowDiagramNode[] => {
  // If the `id` of the node is changed, update the `connections` property of other nodes
  if (updatedNode.hasOwnProperty('id') && nodeId !== updatedNode.id) {
    return nodes.map((node) => {
      if (node.id === nodeId) {
        return patchObject(node, updatedNode);
      }

      let newNode = node;

      if (node.connections.from.includes(nodeId)) {
        newNode = {
          ...node,
          connections: {
            ...node.connections,
            from: node.connections.from.map((conNodeId) =>
              conNodeId === nodeId ? updatedNode.id! : conNodeId,
            ),
          },
        };
      }

      if (node.connections.to.includes(nodeId)) {
        newNode = {
          ...node,
          connections: {
            ...node.connections,
            to: node.connections.to.map((conNodeId) =>
              conNodeId === nodeId ? updatedNode.id! : conNodeId,
            ),
          },
        };
      }

      return newNode;
    });
  }

  // If `id` is not updated, then just patch the node and return updated array of nodes
  return nodes.map((node) => (node.id === nodeId ? patchObject(node, updatedNode) : node));
};
