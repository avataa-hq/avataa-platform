import * as d3 from 'd3';

import { InputNode, LinkedNodesDiagramEvents, LinkedNodesDiagramOptions } from '../model';
import { onNodeMouseEnter, onNodeMouseLeave } from '../lib';

interface DrawNodesParams<N extends InputNode = InputNode> {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  nodesData: N[];
  nodeSvgString?: LinkedNodesDiagramOptions<N>['nodeSvgString'];
  customNodeHtml?: LinkedNodesDiagramOptions<N>['customNodeHtml'];
  width?: LinkedNodesDiagramOptions<N>['nodeWidth'];
  height?: LinkedNodesDiagramOptions<N>['nodeHeight'];
  fillColor?: LinkedNodesDiagramOptions<N>['nodeFillColor'];
  onClick?: LinkedNodesDiagramEvents<N>['onNodeClick'];
}

export const drawNodes = <N extends InputNode = InputNode>({
  svg,
  nodesData,
  nodeSvgString,
  customNodeHtml,
  width = 25,
  height = 25,
  fillColor = 'royalblue',
}: DrawNodesParams<N>) => {
  const nodesGroup = svg.append('g');

  const getWidth = (d: N) => {
    return typeof width === 'function' ? width(d as N) : width;
  };

  const getHeight = (d: N) => {
    return typeof height === 'function' ? height(d as N) : height;
  };

  let nodes: d3.Selection<SVGSVGElement, any, any, unknown>;

  if (nodeSvgString || customNodeHtml) {
    const getNodeSvgSelection = (d: N) => {
      // TODO: Find a way to enable text wrapping without breaking the `foreignObject` computed height
      const nodeDomString = customNodeHtml
        ? `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="lnd__node" style="pointer-events: visible" >
        <foreignObject width="100%" height="100%" overflow="visible">
          <div xmlns="http://www.w3.org/1999/xhtml" style="width: fit-content; height: fit-content; overflow: visible; white-space: nowrap" class="lnd__node__div-container">
            ${typeof customNodeHtml === 'function' ? customNodeHtml(d) : customNodeHtml}
          </div>
        </foreignObject>
      </svg>`
        : nodeSvgString;

      const domParser = new DOMParser();
      const nodeSvgElement = domParser.parseFromString(
        nodeDomString ?? '',
        'image/svg+xml',
      ).documentElement;

      return d3.select<any, any>(nodeSvgElement);
    };

    nodes = nodesGroup
      .selectAll<SVGSVGElement, N>('.lnd__node')
      .data<InputNode>(nodesData)
      .enter()
      .append<SVGSVGElement>((d) =>
        getNodeSvgSelection(d as N)
          .node()
          ?.cloneNode(true),
      );
  } else {
    nodes = nodesGroup
      .selectAll<SVGSVGElement, N>('.lnd__node')
      .data<InputNode>(nodesData)
      .enter()
      .append<SVGSVGElement>('svg')
      .attr('viewBox', (d) => [0, 0, getWidth(d as N) * 2, getHeight(d as N) * 2]);

    nodes
      .append('circle')
      .attr('fill', fillColor)
      .attr('r', (d) => Math.max(getWidth(d), getHeight(d)));
  }

  nodes
    .classed('lnd__node', true)
    .attr('x', ({ x }) => x)
    .attr('y', ({ y }) => y)
    .attr('width', (d) => getWidth(d) ?? null)
    .attr('height', (d) => getHeight(d) ?? null)
    .attr('overflow', 'visible')
    .on('mouseenter', onNodeMouseEnter)
    .on('mouseleave', onNodeMouseLeave);

  return {
    nodesGroup,
    nodes: nodes as unknown as d3.Selection<SVGSVGElement, N & Node, any, unknown>,
  };
};
