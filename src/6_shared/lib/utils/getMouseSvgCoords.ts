export const getMouseSvgCoords = (event: MouseEvent, elem: SVGSVGElement): SVGPoint => {
  const ctm = elem.getScreenCTM();
  const pt = elem.createSVGPoint();
  if (!pt) throw new Error('Could not create SVG point.');
  pt.x = event.clientX;
  pt.y = event.clientY;
  return pt.matrixTransform(ctm?.inverse());
};
