import { INode } from '@antv/g6';

export const getNodeNeighboursKeys = (node: INode) => {
  const nodeModel = node.getModel();

  return Object.keys(
    node.getEdges()?.reduce((acc, edge) => {
      const edgeModel = edge.getModel();
      if (!edgeModel) return acc;
      const neighborKey =
        edgeModel.source === nodeModel.id
          ? edgeModel.targetKey ?? edgeModel.target
          : edgeModel.sourceKey ?? edgeModel.source;

      if (neighborKey === nodeModel.id || !neighborKey) return acc;

      return { ...acc, [neighborKey as string]: neighborKey as string };
    }, {}) ?? {},
  );
};
