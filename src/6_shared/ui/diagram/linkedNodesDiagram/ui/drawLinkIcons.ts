import * as d3 from 'd3';

import {
  D3LinkSelection,
  InputNode,
  LinkedNodesDiagramEvents,
  LinkedNodesDiagramOptions,
  PopulatedLink,
} from '../model';
import { getCoordsAtPathPoint } from '../lib';
import { updateLinkIconAngle } from './updateLinkIconAngle';

export const drawLinkIcons = <N extends InputNode = InputNode>({
  links,
  icons,
  width = 40,
  onClick,
  stopIconRotation = false,
  getLinkIcon = (d: PopulatedLink<N>) => d.icon,
}: {
  links: D3LinkSelection<N>;
  icons: Record<string, string | undefined>;
  width?: LinkedNodesDiagramOptions<N>['linkIconWidth'];
  onClick?: LinkedNodesDiagramEvents<N>['onLinkIconClick'];
  stopIconRotation?: LinkedNodesDiagramOptions<N>['stopLinkIconRotation'];
  getLinkIcon?: LinkedNodesDiagramOptions<N>['getLinkIcon'];
}) => {
  const domParser = new DOMParser();

  const convertedIcons: Record<string, d3.Selection<any, any, null, undefined> | undefined> = {};

  // Convert icons from `string` to d3.Selection
  Object.entries(icons).forEach(([key, value]) => {
    if (value === undefined) return;

    const svgElement = domParser.parseFromString(value, 'image/svg+xml').documentElement;

    convertedIcons[key] = d3.select(svgElement);
  });

  // For each link draw its icon
  links.each(function drawLinkIcon() {
    const link = d3.select<SVGGElement, PopulatedLink<N>>(this);
    const linkIcon = typeof getLinkIcon === 'function' ? getLinkIcon(link.datum()) : getLinkIcon;
    const linkPathEl = link.select<SVGPathElement>('.lnd__link-path').node();

    if (!linkPathEl) return;

    const middlePoint = getCoordsAtPathPoint(linkPathEl);

    if (linkIcon !== undefined && convertedIcons[linkIcon] !== undefined) {
      const linkIconSelection = convertedIcons[linkIcon];

      const linkIconViewBox = linkIconSelection!
        .attr('viewBox')
        .split(' ')
        .map((v) => +v);

      link
        .append<SVGSVGElement>(() => linkIconSelection?.node()?.cloneNode(true))
        .classed('lnd__link-icon', true)
        .attr('overflow', 'visible')
        .attr('width', width)
        // Adjust height depending on width and viewBox
        .attr('height', width * (linkIconViewBox[3] / linkIconViewBox[2]))
        // Translate the origin of viewBox to the center
        .attr('viewBox', [
          linkIconViewBox[2] / 2,
          linkIconViewBox[3] / 2,
          linkIconViewBox[2],
          linkIconViewBox[3],
        ])
        .attr('x', middlePoint.x)
        .attr('y', middlePoint.y)
        .on('click', (e, d) => {
          onClick?.(e, d as PopulatedLink<N>);
        });

      // Adjust the rotation of icon
      if (!stopIconRotation) updateLinkIconAngle<N>(link);
    }
  });
};
