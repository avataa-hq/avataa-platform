import * as d3 from 'd3';

import { Node, D3NodeSelection, LinkedNodesDiagramOptions, InputNode } from '../model';

interface DrawNodeConnectionPointsParams<N extends InputNode = InputNode> {
  nodes: D3NodeSelection<N>;
  radius?: number;
  strokeColor?: LinkedNodesDiagramOptions<N>['connectionPointStrokeColor'];
  fillColor?: LinkedNodesDiagramOptions<N>['connectionPointFillColor'];
  strokeWidth?: LinkedNodesDiagramOptions<N>['connectionPointStrokeWidth'];
}

const connectionPoints = [
  {
    id: 1,
    x: 0,
    y: -1,
    className: 'lnd__node__connection-top',
  },
  {
    id: 2,
    x: 1,
    y: 0,
    className: 'lnd__node__connection-right',
  },
  {
    id: 3,
    x: 0,
    y: 1,
    className: 'lnd__node__connection-bottom',
  },
  {
    id: 4,
    x: -1,
    y: 0,
    className: 'lnd__node__connection-left',
  },
];

export const drawNodeConnectionPoints = <N extends InputNode = InputNode>({
  nodes,
  radius = 5,
  strokeColor = 'royalblue',
  fillColor = '#ffffff33',
  strokeWidth = 1.5,
}: DrawNodeConnectionPointsParams<N>) => {
  const getStrokeColor = (d: Node) => {
    return typeof strokeColor === 'function' ? strokeColor(d as N) : strokeColor;
  };

  const getFillColor = (d: Node) => {
    return typeof fillColor === 'function' ? fillColor(d as N) : fillColor;
  };

  const getStrokeWidth = (d: Node) => {
    return typeof strokeWidth === 'function' ? strokeWidth(d as N) : strokeWidth;
  };

  connectionPoints.forEach(({ className, x: pointX, y: pointY }) =>
    nodes
      .append('circle')
      .classed('lnd__node__connection', true)
      .each(function appendClassName() {
        d3.select(this).classed(className, true);
      })
      .attr('stroke-width', getStrokeWidth)
      .attr('stroke', getStrokeColor)
      .attr('cx', ({ width }) => (width ? (width / 2) * pointX : 0))
      .attr('cy', ({ height }) => (height ? (height / 2) * pointY : 0))
      .attr('r', radius)
      .attr('fill', getFillColor)
      .attr('opacity', 0)
      .attr('pointer-events', 'none')
      .on('mouseenter', function onConnectionPointMouseEnter() {
        const thisPoint = d3.select<SVGCircleElement, Node>(this);
        thisPoint
          .transition()
          .duration(100)
          .attr('r', radius * 1.4)
          .attr('opacity', 1);
      })
      .on('mouseleave', function onConnectionPointMouseLeave() {
        const thisPoint = d3.select<SVGCircleElement, Node>(this);
        thisPoint.transition().duration(100).attr('r', radius);
      }),
  );
};
