export const setSvgDefs = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
  const defs = svg.append('defs');

  const linkMarker = defs
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto-start-reverse');

  const linkMarkerPath = linkMarker
    .append('path')
    .attr('fill', 'context-stroke')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z');

  const newLinkMarker = defs
    .append('marker')
    .attr('id', 'new-link-arrow')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto-start-reverse');

  const newLinkMarkerPath = newLinkMarker
    .append('path')
    .attr('fill', 'context-stroke')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z');

  return { defs, newLinkMarkerPath, linkMarkerPath };
};
