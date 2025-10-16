import * as d3 from 'd3';

import {
  Node,
  D3NodeSelection,
  D3LinkSelection,
  LinkedNodesDiagramOptions,
  InputNode,
  LinkedNodesDiagramEvents,
  PopulatedLink,
} from '../model';
import { isOutsideSVG } from '../lib';
import { updateConnectionPointsVisibility, updateLink, updateLinkIconAngle } from '../ui';

export const addDragToNodes = <N extends InputNode = InputNode>({
  svg,
  nodes,
  links,
  stopIconRotation = false,
  isConnectionValid,
  onNodeDragEnd,
  getLinkLabel,
}: {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  nodes: D3NodeSelection<N>;
  links: D3LinkSelection<N>;
  onNodeDragEnd?: LinkedNodesDiagramEvents<N>['onNodeDragEnd'];
  zoomTransform?: d3.ZoomTransform;
  stopIconRotation?: LinkedNodesDiagramOptions<N>['stopLinkIconRotation'];
  isConnectionValid?: LinkedNodesDiagramOptions<N>['isConnectionValid'];
  getLinkLabel?: LinkedNodesDiagramOptions<N>['getLinkLabel'];
}) => {
  function dragstarted(this: Element) {
    d3.select(this).raise();
  }

  function dragged(this: any, event: any, draggedNode: any) {
    if (isOutsideSVG(svg, event.sourceEvent.clientX, event.sourceEvent.clientY)) {
      return;
    }

    // Update node position
    draggedNode.x = event.x;
    draggedNode.y = event.y;

    d3.select(this).attr('x', draggedNode.x).attr('y', draggedNode.y);

    // Update links position
    links.each(function updateLinkPosition(this, linkData: any) {
      const linkSelection = d3.select<SVGGElement, PopulatedLink<N>>(this);

      if (linkData.source.id === draggedNode.id) {
        updateLink<N>({
          linkSelection,
          source: draggedNode,
          target: linkData.target,
          getLinkLabel,
        });
        if (!stopIconRotation) updateLinkIconAngle(linkSelection);
      } else if (linkData.target.id === draggedNode.id) {
        updateLink<N>({
          linkSelection,
          source: linkData.source,
          target: draggedNode,
          getLinkLabel,
        });
        if (!stopIconRotation) updateLinkIconAngle(linkSelection);
      }
    });

    // Update connection points visibility
    updateConnectionPointsVisibility<N>({
      nodes,
      activeNode: d3.select<SVGSVGElement, N & Node>(this) || undefined,
      isConnectionValid,
    });
  }

  function dragended(this: Element, event: any) {
    onNodeDragEnd?.(event, d3.select(this).datum() as N & Node);
  }

  nodes.call(
    d3
      .drag<SVGSVGElement, N & Node>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended),
  );
};
