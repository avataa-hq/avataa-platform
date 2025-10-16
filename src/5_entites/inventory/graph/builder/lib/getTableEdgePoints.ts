import { IEdge } from '@antv/g6';
import {
  CustomEdgeConfig,
  CustomNodeConfig,
  TABLE_NODE_BODY_MAX_HEIGHT,
  TABLE_NODE_HEADER_HEIGHT,
  TABLE_NODE_ITEM_HEIGHT,
  TABLE_NODE_TYPE,
} from '6_shared';

export const getTableEdgePoints = (edge: IEdge) => {
  const edgeModel = edge.getModel() as CustomEdgeConfig;
  const sourceNode = edge.getSource().getModel() as CustomNodeConfig;
  const targetNode = edge.getTarget().getModel() as CustomNodeConfig;

  const sourceIndex = sourceNode.tableRows?.findIndex((e) => e.key === edgeModel.sourceKey) ?? 0;
  const sourceStartIndex = sourceNode.startIndex || 0;
  let sourceY = TABLE_NODE_HEADER_HEIGHT / 2;

  if (!sourceNode.collapsed && sourceIndex > sourceStartIndex - 1) {
    sourceY =
      TABLE_NODE_HEADER_HEIGHT + (sourceIndex - sourceStartIndex + 0.5) * TABLE_NODE_ITEM_HEIGHT;
    sourceY = sourceNode.isExpanded
      ? sourceY
      : Math.min(sourceY, TABLE_NODE_BODY_MAX_HEIGHT + TABLE_NODE_HEADER_HEIGHT);
  }

  const targetIndex = targetNode.tableRows?.findIndex((e) => e.key === edgeModel.targetKey) ?? 0;
  const targetStartIndex = targetNode.startIndex || 0;
  let targetY = TABLE_NODE_HEADER_HEIGHT / 2;

  if (!targetNode.collapsed && targetIndex > targetStartIndex - 1) {
    targetY =
      (targetIndex - targetStartIndex + 0.5) * TABLE_NODE_ITEM_HEIGHT + TABLE_NODE_HEADER_HEIGHT;
    targetY = targetNode.isExpanded
      ? targetY
      : Math.min(targetY, TABLE_NODE_BODY_MAX_HEIGHT + TABLE_NODE_HEADER_HEIGHT);
  }

  const startPoint = {
    x: 0,
    y: 0,
    index: -1,
    ...edgeModel.startPoint,
  };
  const endPoint = {
    x: 0,
    y: 0,
    index: -1,
    ...edgeModel.endPoint,
  };

  startPoint.y =
    sourceNode.type === TABLE_NODE_TYPE ? startPoint.y + sourceY : edgeModel.startPoint?.y ?? 0;
  endPoint.y =
    targetNode.type === TABLE_NODE_TYPE ? endPoint.y + targetY : edgeModel.endPoint?.y ?? 0;

  return { startPoint, endPoint };
};
