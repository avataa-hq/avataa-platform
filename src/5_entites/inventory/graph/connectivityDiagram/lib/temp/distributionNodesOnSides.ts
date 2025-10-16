import { Node, Rectangle } from '@antv/x6';
import { CablesSides, ICustomDiagramNode } from '../../modal/types';

const getSingle = (
  side: CablesSides,
  cable: ICustomDiagramNode,
  sleeveBBox: Rectangle,
  xOffset: number,
  yOffset: number,
): ICustomDiagramNode & { x: number; y: number } => {
  let x = 0;
  let y = 0;

  if (side === 'left') {
    x = sleeveBBox.right + xOffset;
    y = sleeveBBox.rightMiddle.y - cable.height! / 2;
  }
  if (side === 'right') {
    x = sleeveBBox.left - cable.width! - xOffset;
    y = sleeveBBox.leftMiddle.y - cable.height! / 2;
  }

  if (side === 'bottom') {
    x = sleeveBBox.topCenter.x - cable.width! / 2;
    y = sleeveBBox.topCenter.y - (cable.height! + yOffset);
  }

  if (side === 'top') {
    x = sleeveBBox.bottomCenter.x - cable.width! / 2;
    y = sleeveBBox.bottomCenter.y + yOffset;
  }

  return { ...cable, x, y };
};

const getMultiple = (
  side: CablesSides,
  cable: ICustomDiagramNode[],
  sleeveBBox: Rectangle,
  xOffset: number,
  yOffset: number,
  sleeveBorderPadding: number,
  offsetBetweenCable: number,
): (ICustomDiagramNode & { x: number; y: number })[] => {
  const result: (ICustomDiagramNode & { x: number; y: number })[] = [];
  const { bottomLine, bottom, top, topLine, rightLine, right, left, leftLine } = sleeveBBox;

  if (side === 'left') {
    cable.forEach((c, idx) => {
      result.push({
        ...c,
        x: right + xOffset,
        y: sleeveBorderPadding + rightLine.start.y + (c.height! + offsetBetweenCable) * idx,
      });
    });
  }
  if (side === 'right') {
    cable.forEach((c, idx) => {
      result.push({
        ...c,
        x: left - c.width! - xOffset,
        y: sleeveBorderPadding + leftLine.start.y + (c.height! + offsetBetweenCable) * idx,
      });
    });
  }

  if (side === 'top') {
    cable.forEach((c, idx) => {
      result.push({
        ...c,
        x: sleeveBorderPadding + bottomLine.start.x + (c.width! + offsetBetweenCable) * idx,
        y: bottom + yOffset + (idx + 1),
      });
    });
  }
  if (side === 'bottom') {
    cable.forEach((c, idx) => {
      result.push({
        ...c,
        x: sleeveBorderPadding + topLine.start.x + (c.width! + offsetBetweenCable) * idx,
        y: top - (c.height! + yOffset),
      });
    });
  }

  return result;
};

interface IProps {
  cablesData: Record<CablesSides, ICustomDiagramNode[]>;
  sleeveNode: Node<Node.Properties>;
  xOffset: number;
  yOffset: number;
  portSize: number;
  sleeveBorderPadding?: number;
  offsetBetweenCable?: number;
}

export const distributionNodesOnSides = ({
  sleeveNode,
  cablesData,
  xOffset = 100,
  yOffset = 100,
  portSize,
  sleeveBorderPadding = 0,
  offsetBetweenCable = 10,
}: IProps) => {
  const { bottom, top, right, left } = cablesData;
  const sleeveBBox = sleeveNode.getBBox();
  let rightNodesWithPositions: (ICustomDiagramNode & { x: number; y: number })[] = [];
  let leftNodesWithPositions: (ICustomDiagramNode & { x: number; y: number })[] = [];
  let topNodesWithPositions: (ICustomDiagramNode & { x: number; y: number })[] = [];
  let bottomNodesWithPositions: (ICustomDiagramNode & { x: number; y: number })[] = [];

  if (left.length === 1) {
    rightNodesWithPositions.push(getSingle('left', left[0], sleeveBBox, xOffset, yOffset));
  } else {
    rightNodesWithPositions = getMultiple(
      'left',
      left,
      sleeveBBox,
      xOffset,
      yOffset,
      sleeveBorderPadding,
      offsetBetweenCable,
    );
  }
  if (right.length === 1) {
    leftNodesWithPositions.push(getSingle('right', right[0], sleeveBBox, xOffset, yOffset));
  } else {
    leftNodesWithPositions = getMultiple(
      'right',
      right,
      sleeveBBox,
      xOffset,
      yOffset,
      sleeveBorderPadding,
      offsetBetweenCable,
    );
  }

  if (bottom.length === 1) {
    topNodesWithPositions.push(getSingle('bottom', bottom[0], sleeveBBox, xOffset, yOffset));
  } else {
    topNodesWithPositions = getMultiple(
      'bottom',
      bottom,
      sleeveBBox,
      xOffset,
      yOffset,
      sleeveBorderPadding,
      offsetBetweenCable,
    );
  }

  if (top.length === 1) {
    bottomNodesWithPositions.push(getSingle('top', top[0], sleeveBBox, xOffset, yOffset));
  } else {
    bottomNodesWithPositions = getMultiple(
      'top',
      top,
      sleeveBBox,
      xOffset,
      yOffset,
      sleeveBorderPadding,
      offsetBetweenCable,
    );
  }

  if (rightNodesWithPositions.length) {
    rightNodesWithPositions = rightNodesWithPositions.map((node) => {
      return {
        ...node,
        y: node.y + portSize / 2,
      };
    });
  }
  if (!rightNodesWithPositions.length && leftNodesWithPositions.length) {
    leftNodesWithPositions = leftNodesWithPositions.map((node) => {
      return {
        ...node,
        y: node.y + portSize / 2,
      };
    });
  }

  if (topNodesWithPositions.length) {
    topNodesWithPositions = topNodesWithPositions.map((node) => {
      return {
        ...node,
        x: node.x + portSize / 2,
      };
    });
  }

  if (!topNodesWithPositions.length && bottomNodesWithPositions.length) {
    bottomNodesWithPositions = bottomNodesWithPositions.map((node) => {
      return {
        ...node,
        x: node.x + portSize / 2,
      };
    });
  }

  return {
    rightNodesWithPositions,
    leftNodesWithPositions,
    topNodesWithPositions,
    bottomNodesWithPositions,
  };
};
