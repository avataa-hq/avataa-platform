export const getCoordsAtPathPoint = (
  path: SVGPathElement,
  point: number = 0.5,
  offset: number = 0,
) => {
  const linkPathLength = path.getTotalLength();
  const middlePoint = path.getPointAtLength(linkPathLength * point + offset);

  return middlePoint;
};
