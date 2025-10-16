import * as d3 from 'd3';

import { D3LinkSelection, InputNode, LinkedNodesDiagramOptions, PopulatedLink } from '../model';
import { getCoordsAtPathPoint, getLinkLabelConfig } from '../lib';

export const drawLinkLabels = <N extends InputNode = InputNode>({
  links,
  getLinkLabel = (d: PopulatedLink<N>) => d.icon,
}: {
  links: D3LinkSelection<N>;
  getLinkLabel?: LinkedNodesDiagramOptions<N>['getLinkLabel'];
}) => {
  const getLabelSvgSelection = (d: PopulatedLink<N>, label: string) => {
    const labelDomString = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="lnd__link-label" >
          <foreignObject width="100%" height="100%" overflow="visible">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width: fit-content; height: fit-content; overflow: visible; white-space: nowrap" class="lnd__link-label__div-container">
              ${label}
            </div>
          </foreignObject>
        </svg>`;

    const domParser = new DOMParser();
    const labelSvgElement = domParser.parseFromString(
      labelDomString,
      'image/svg+xml',
    ).documentElement;

    return d3.select<any, any>(labelSvgElement);
  };

  // For each link draw its icon
  links.each(function drawLinkLabel() {
    const link = d3.select<SVGGElement, PopulatedLink<N>>(this);
    const linkPathEl = link.select<SVGPathElement>('.lnd__link-path').node();
    const linkLabelConfig = getLinkLabelConfig(getLinkLabel, link.datum());

    if (!linkPathEl || linkLabelConfig.value === '') return;

    const labelCoords = getCoordsAtPathPoint(
      linkPathEl,
      linkLabelConfig.position,
      linkLabelConfig.offset,
    );
    const linkLabelSelection = getLabelSvgSelection(link.datum(), linkLabelConfig.value);

    link
      .append<SVGSVGElement>(() => linkLabelSelection?.node()?.cloneNode(true))
      .classed('lnd__link-label', true)
      .attr('overflow', 'visible')
      .attr('x', labelCoords.x)
      .attr('y', labelCoords.y)
      .attr('overflow', 'visible');

    // Centering the label
    const foreignObject = this.querySelector('foreignObject');
    const linkLabelDivContainer = this.querySelector<HTMLDivElement>(
      '.lnd__link-label__div-container',
    );
    if (linkLabelDivContainer) {
      const { offsetHeight, offsetWidth } = linkLabelDivContainer;

      if (foreignObject)
        foreignObject.style.transform = `translate(-${offsetWidth / 2}px, -${offsetHeight / 2}px)`;
    }
  });
};
