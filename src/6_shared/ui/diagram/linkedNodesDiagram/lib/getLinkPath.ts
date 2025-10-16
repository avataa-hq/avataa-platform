import { getNodeConnectionPoints } from './getConnectionPoints';

interface LinkPathPoint {
  x: number;
  y: number;
  offsetX?: number;
  offsetY?: number;
}

interface GetLinkPathParams {
  start: LinkPathPoint;
  end: LinkPathPoint;
  maxArcRadius?: number;
}

export const getLinkPath = ({ start, end, maxArcRadius = 25 }: GetLinkPathParams) => {
  if (!start.offsetX) start.offsetX = 0;
  if (!start.offsetY) start.offsetY = 0;
  if (!end.offsetX) end.offsetX = 0;
  if (!end.offsetY) end.offsetY = 0;

  const adjustedStart = {
    ...start,
  };

  const adjustedEnd = {
    ...end,
  };

  const direction = {
    x: Math.sign(end.x - start.x),
    y: Math.sign(end.y - start.y),
  };

  const orientation: Record<string, 'vertical' | 'horizontal'> = {
    start: 'vertical',
    end: 'vertical',
  };

  const connectionPoints = getNodeConnectionPoints(
    { x: start.x, y: start.y, width: start.offsetX * 2, height: start.offsetY * 2 },
    { x: end.x, y: end.y, width: end.offsetX * 2, height: end.offsetY * 2 },
  );

  // Adjust the end and the start of the path depending on node radius
  adjustedStart.x += start.offsetX * connectionPoints[0].x;
  adjustedStart.y += start.offsetY * connectionPoints[0].y;
  adjustedEnd.x += end.offsetX * connectionPoints[1].x;
  adjustedEnd.y += end.offsetY * connectionPoints[1].y;

  // Adjust the shape of the path
  if (connectionPoints[0].x !== 0) {
    orientation.start = 'horizontal';
  } else if (connectionPoints[0].y !== 0) {
    orientation.start = 'vertical';
  }

  if (connectionPoints[1].x !== 0) {
    orientation.end = 'horizontal';
  } else if (connectionPoints[1].y !== 0) {
    orientation.end = 'vertical';
  }

  const distance = {
    x: Math.abs(adjustedEnd.x - adjustedStart.x),
    y: Math.abs(adjustedEnd.y - adjustedStart.y),
  };

  const distanceVector = {
    x: adjustedEnd.x - adjustedStart.x,
    y: adjustedEnd.y - adjustedStart.y,
  };

  const middleCoord = {
    x: adjustedStart.x + distanceVector.x / 2,
    y: adjustedStart.y + distanceVector.y / 2,
  };

  const arcRadius = Math.min(maxArcRadius * 2, Math.min(distance.x, distance.y)) / 2;

  const arcRadiusVector = {
    x: arcRadius * direction.x,
    y: arcRadius * direction.y,
  };

  // Arc parameters
  const largeArcFlag = 0;
  const sweepFlag = direction.x === direction.y ? 1 : 0;
  const inversedSweepFlag = direction.x === direction.y ? 0 : 1;

  // When the link has only one curve. The path starts horizontally and ends vertically.
  if (orientation.start === 'horizontal' && orientation.end === 'vertical') {
    return `
      M ${adjustedStart.x} ${adjustedStart.y}
      H ${adjustedEnd.x - arcRadiusVector.x}
      A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${adjustedEnd.x} ${
      adjustedEnd.y - distanceVector.y + arcRadiusVector.y
    }
      V ${adjustedEnd.y}
    `;
  }

  // When the link has only one curve. The path starts vertically and ends horizontally.
  if (orientation.start === 'vertical' && orientation.end === 'horizontal') {
    return `
    M ${adjustedStart.x} ${adjustedStart.y}
    V ${adjustedEnd.y - arcRadiusVector.y}
    A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${inversedSweepFlag} ${
      adjustedEnd.x - distanceVector.x + arcRadiusVector.x
    } ${adjustedEnd.y}
    H ${adjustedEnd.x}
    `;
  }

  // When the link has two curves. The path starts vertically from both ends.
  if (orientation.start === 'vertical' && orientation.end === 'vertical') {
    return `
    M ${adjustedStart.x} ${adjustedStart.y}
    ${
      adjustedStart.y - (middleCoord.y - arcRadiusVector.y) !== 0
        ? `V ${middleCoord.y - arcRadiusVector.y}`
        : ''
    }
    A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${inversedSweepFlag} ${
      adjustedStart.x + arcRadiusVector.x
    } ${middleCoord.y}
    H ${adjustedEnd.x - arcRadiusVector.x}
    A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${adjustedEnd.x} ${
      middleCoord.y + arcRadiusVector.y
    }
     ${adjustedEnd.y - (middleCoord.y + arcRadiusVector.y) !== 0 ? `V ${adjustedEnd.y}` : ''}
    `;
  }

  // When the link has two curves. The path starts horizontally from both ends.
  if (orientation.start === 'horizontal' && orientation.end === 'horizontal') {
    return `
    M ${adjustedStart.x} ${adjustedStart.y}
    H ${middleCoord.x - arcRadiusVector.x}
    A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${middleCoord.x} ${
      adjustedStart.y + arcRadiusVector.y
    }
    V ${adjustedEnd.y - arcRadiusVector.y}
    A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${inversedSweepFlag} ${
      middleCoord.x + arcRadiusVector.x
    } ${adjustedEnd.y}
    ${adjustedEnd.x - (middleCoord.x + arcRadiusVector.x) !== 0 ? `H ${adjustedEnd.x}` : ''}
  `;
  }

  return '';
};
