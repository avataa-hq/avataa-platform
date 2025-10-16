import * as d3 from 'd3';
import { getMouseSvgCoords } from '6_shared/lib';

// TODO: Find a way to implement pan and zoom. Solve the problem with unresponsize nodes on drag after zoom.

export const addPanAndZoom = ({
  svg,
  initialViewBox,
  onPanAndZoom,
  minZoom,
  maxZoom,
}: {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  initialViewBox: number[];
  onPanAndZoom?: (viewBox: number[]) => void;
  minZoom: number;
  maxZoom: number;
}) => {
  let anchorPoint: DOMPoint = new DOMPoint();
  const svgEl = svg.node();
  let prevViewBox = svg
    .attr('viewBox')
    .split(',')
    .map((v) => Number(v));

  function handleZoom(event: any) {
    if (!svgEl) return;

    if (event.transform.k < minZoom) event.transform.k = minZoom;
    if (event.transform.k > maxZoom) event.transform.k = maxZoom;

    const vb = svg
      .attr('viewBox')
      .split(',')
      .map((v) => Number(v));

    const newWidth = initialViewBox[2] / event.transform.k;
    const newHeight = initialViewBox[3] / event.transform.k;

    const newMinX = vb[0] - (newWidth - vb[2]) / 2;
    const newMinY = vb[1] - (newHeight - vb[3]) / 2;

    const updatedViewBox = [newMinX, newMinY, newWidth, newHeight];
    onPanAndZoom?.(updatedViewBox);
    svg.attr('viewBox', updatedViewBox);
  }

  function dragstarted(this: Element, event: any) {
    if (!svgEl) return;

    anchorPoint = getMouseSvgCoords(event.sourceEvent, svgEl);
  }

  function dragged(this: any, event: any) {
    if (!svgEl) return;

    prevViewBox = svg
      .attr('viewBox')
      .split(',')
      .map((v) => Number(v));

    const targetPoint = getMouseSvgCoords(event.sourceEvent, svgEl);

    const updatedViewBox = [
      prevViewBox[0] - (targetPoint.x - anchorPoint.x),
      prevViewBox[1] - (targetPoint.y - anchorPoint.y),
      prevViewBox[2],
      prevViewBox[3],
    ];

    svg.attr('viewBox', updatedViewBox);
  }

  function dragended() {
    const updatedViewBox = svg
      .attr('viewBox')
      .split(',')
      .map((v) => Number(v));
    onPanAndZoom?.(updatedViewBox);
  }

  svg.call(
    d3
      .drag<SVGSVGElement, unknown>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended),
  );
  svg.call(d3.zoom<SVGSVGElement, any>().on('zoom', handleZoom));
};
