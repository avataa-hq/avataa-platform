import * as d3 from 'd3';

import { getLinkPath } from '../lib';
import {
  eventFlags,
  InputNode,
  Link,
  LinkedNodesDiagramOptions,
  Node,
  PopulatedLink,
} from '../model';

interface DrawLinksParams<N extends InputNode = InputNode> {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  linksData: Link[];
  nodesData: Node[];
  opacity?: LinkedNodesDiagramOptions<N>['linkOpacity'];
  outlineColor?: LinkedNodesDiagramOptions<N>['linkOutlineColor'];
  width?: LinkedNodesDiagramOptions<N>['linkWidth'];
  color?: LinkedNodesDiagramOptions<N>['linkColor'];
  dashArray?: LinkedNodesDiagramOptions<N>['linkDashArray'] | null;
  animatedDash?: boolean;
  animatedCircle?: boolean;
  linkMarkerPath?: d3.Selection<SVGPathElement, unknown, null, undefined>;
}

export const drawLinks = <N extends InputNode = InputNode>({
  svg,
  linksData,
  nodesData,
  opacity = 1,
  width = 1.5,
  color = '#92ABFF',
  dashArray = null,
  animatedDash,
  animatedCircle,
  linkMarkerPath,
  outlineColor = '#92ABFF',
}: DrawLinksParams<N>) => {
  const linksGroup = svg.insert('g', ':first-child');

  const getOutlineColor = (d: PopulatedLink<N>) => {
    return typeof outlineColor === 'function' ? outlineColor(d) : outlineColor;
  };

  const getColor = (d: PopulatedLink<N>) => {
    return typeof color === 'function' ? color(d) : color;
  };

  const links = linksGroup
    .selectAll<SVGPathElement, Link>('g')
    .data<PopulatedLink<N>>(
      linksData
        .filter((link) => link.source && link.target)
        .map((l) => ({
          ...l,
          source:
            (nodesData.find((c) => c.id === l.source) as N & Node) || (nodesData[0] as N & Node),
          target:
            (nodesData.find((c) => c.id === l.target) as N & Node) || (nodesData[0] as N & Node),
        })),
    )
    .join('g')
    .classed('lnd__link', true);

  links.each(function appendLink() {
    const link = d3.select<SVGGElement, PopulatedLink<N>>(this);
    const linkDatum = link.datum();

    const linkPath = getLinkPath({
      start: {
        x: linkDatum.source.x,
        y: linkDatum.source.y,
        offsetX: linkDatum.source.width / 2,
        offsetY: linkDatum.source.height / 2,
      },
      end: {
        x: linkDatum.target.x,
        y: linkDatum.target.y,
        offsetX: linkDatum.target.width / 2,
        offsetY: linkDatum.target.height / 2,
      },
    });

    // Append link hitboxes
    link
      .append('path')
      .classed('lnd__link-hitbox', true)
      .attr('stroke-width', '25')
      .attr('stroke-opacity', 0)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('d', linkPath);

    // Append visible link paths
    const visiblePath = link
      .append('path')
      .each(function setMarkerColor() {
        linkMarkerPath?.attr('fill', () => getColor(linkDatum));
      })
      .classed('lnd__link-path', true)
      .attr('stroke-width', width)
      .attr('stroke-opacity', opacity)
      .attr('stroke', color)
      .attr('stroke-dasharray', dashArray)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrow)')
      .attr('d', linkPath);

    if (dashArray && animatedDash) visiblePath.classed('lnd_animated-dash-path', true);

    if (animatedCircle) {
      link
        .append('circle')
        .attr('r', 5)
        .attr('fill', getColor)
        .classed('lnd__link-animated-circle', true)
        .append('animateMotion')
        .attr('path', linkPath)
        .attr('repeatCount', 'indefinite')
        // Generate random duration between 1s and 3s
        .attr('dur', (Math.random() + 0.5) * 2);
    }
  });

  // links.on('mouseover', function drawOutline(event, d) {
  //   if (eventFlags.newLinkCreation) return;

  //   this.style.filter = `drop-shadow(2px 0 0 ${getOutlineColor(
  //     d,
  //   )}) drop-shadow(-2px 0 0 ${getOutlineColor(d)}) drop-shadow(0 2px 0 ${getOutlineColor(
  //     d,
  //   )}) drop-shadow(0 -2px 0 ${getOutlineColor(d)})`;
  // });

  // links.on('mouseleave', function removeOutline() {
  //   this.style.filter = 'none';
  // });

  return { linksGroup, links };
};
