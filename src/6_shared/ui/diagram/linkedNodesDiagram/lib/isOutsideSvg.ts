export const isOutsideSVG = (svg: any, x: number, y: number) => {
  const svgRect = svg.node().getBoundingClientRect();
  return x < svgRect.left || x > svgRect.right || y < svgRect.top || y > svgRect.bottom;
};
