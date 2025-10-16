import { Node } from '../model';

/**
 * Returns array of two objects (first one is for the `startNode` and the second one is for `endNode`). Each object contains position of the connection node relative to the center of the node.
 * 
 * `nodeDistancePadding` sets how close to the same axis two nodes should be for the path to change the shape and origin point
 * 
 * @param startNode
 * @param endNode
 * @param nodeDistancePadding
 * @returns ```
[{ x: 0, y: 0 }, { x: 0, y: 0 }]
 * ```
 */
export const getNodeConnectionPoints = (
  startNode: Pick<Node, 'x' | 'y' | 'width' | 'height'>,
  endNode: Pick<Node, 'x' | 'y' | 'width' | 'height'>,
  nodeDistancePadding = 30,
) => {
  const direction = {
    x: Math.sign(endNode.x - startNode.x),
    y: Math.sign(endNode.y - startNode.y),
  };

  const isXDistanceGreater = Math.abs(endNode.x - startNode.x) > Math.abs(endNode.y - startNode.y);
  const isNodeTooClose =
    Math.abs(isXDistanceGreater ? endNode.y - startNode.y : endNode.x - startNode.x) <=
    (isXDistanceGreater
      ? startNode.height / 2 + endNode.height / 2 + nodeDistancePadding
      : startNode.width / 2 + endNode.width / 2 + nodeDistancePadding);

  const connectionPoints = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];

  if (isXDistanceGreater) {
    if (isNodeTooClose) {
      connectionPoints[0].x = direction.x;
      connectionPoints[1].x = -direction.x;
    } else {
      connectionPoints[0].y = direction.y;
      connectionPoints[1].y = -direction.y;
    }
  } else if (isNodeTooClose) {
    connectionPoints[0].y = direction.y;
    connectionPoints[1].y = -direction.y;
  } else {
    connectionPoints[0].x = direction.x;
    connectionPoints[1].x = -direction.x;
  }

  return connectionPoints;
};
