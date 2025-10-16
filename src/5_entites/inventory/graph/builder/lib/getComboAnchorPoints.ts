export const getComboAnchorPoints = (numPoints: number = 12) => {
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (Math.PI * 2 * i) / numPoints;
    const x = 0.5 + 0.5 * Math.cos(angle);
    const y = 0.5 + 0.5 * Math.sin(angle);
    points.push([x, y]);
  }

  return points;
};
