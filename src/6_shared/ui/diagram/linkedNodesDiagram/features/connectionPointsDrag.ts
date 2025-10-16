import * as d3 from 'd3';

import { getLinkPath, isOutsideSVG, onNodeMouseLeave } from '../lib';
import {
  D3NodeSelection,
  Node,
  activeNodeObserver,
  LinkedNodesDiagramOptions,
  LinkedNodesDiagramEvents,
  InputNode,
  eventFlags,
} from '../model';

export const addDragToConnectionPoints = <N extends InputNode = InputNode>({
  nodes,
  linksGroup,
  svg,
  onNodesConnect,
  newLinkColor,
  newLinkDashArray,
  newLinkOpacity,
  newLinkWidth,
  isConnectionValid,
  newLinkMarkerPath,
}: {
  nodes: D3NodeSelection<N>;
  linksGroup: d3.Selection<SVGGElement, unknown, null, undefined>;
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  onNodesConnect?: LinkedNodesDiagramEvents<N>['onLinkAdd'];
  newLinkColor: NonNullable<LinkedNodesDiagramOptions<N>['newLinkColor']>;
  newLinkWidth: NonNullable<LinkedNodesDiagramOptions<N>['newLinkWidth']>;
  newLinkDashArray: NonNullable<LinkedNodesDiagramOptions<N>['newLinkDashArray']>;
  newLinkOpacity: NonNullable<LinkedNodesDiagramOptions<N>['newLinkOpacity']>;
  isConnectionValid?: LinkedNodesDiagramOptions<N>['isConnectionValid'];
  newLinkMarkerPath?: d3.Selection<SVGPathElement, unknown, null, undefined>;
}) => {
  let sourceParentNode: d3.Selection<SVGSVGElement, Node, SVGSVGElement, any> | undefined;
  let newLink: d3.Selection<SVGPathElement, unknown, null, undefined> | null = null;

  let parentData: N & Node = {
    id: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  } as N & Node;

  const getNewLinkColor = (d: N & Node) =>
    typeof newLinkColor === 'function' ? newLinkColor(d) : newLinkColor;

  function dragstarted(this: Element) {
    const parentElement = this.closest<SVGSVGElement>('.lnd__node');
    if (parentElement) {
      // @ts-expect-error - No need
      sourceParentNode = d3.select<SVGSVGElement, Node>(parentElement);
    }
    if (!sourceParentNode) return;

    eventFlags.newLinkCreation = true;

    parentData = sourceParentNode.datum() as N & Node;

    newLinkMarkerPath?.attr('fill', () => getNewLinkColor(parentData as N & Node));

    newLink = linksGroup
      .append('path')
      .attr('stroke-width', newLinkWidth)
      .attr('stroke-opacity', newLinkOpacity)
      .attr('stroke-dasharray', newLinkDashArray)
      .attr('stroke', () => getNewLinkColor(parentData as N & Node))
      .attr('fill', 'none')
      .attr('marker-end', 'url(#new-link-arrow)')
      .attr('d', () =>
        getLinkPath({
          start: parentData,
          end: parentData,
        }),
      );

    const parentEl = this.closest<SVGSVGElement>('.lnd__node');
    const parentNode: D3NodeSelection | null = parentEl && d3.select<SVGSVGElement, Node>(parentEl);

    if (parentNode && !activeNodeObserver.getActiveNode()) {
      activeNodeObserver.setActiveNode(parentNode);
    }

    nodes.on('mouseleave', null);
  }

  function dragged(this: Element, event: any) {
    if (!newLink) return;
    const draggingElement = d3.select(this);

    newLink.attr('d', () =>
      getLinkPath({
        start: {
          x: parentData.x,
          y: parentData.y,
          offsetX: parentData.width / 2,
          offsetY: parentData.height / 2,
        },
        end: {
          x: event.x + Number(draggingElement.attr('cx')),
          y: event.y + Number(draggingElement.attr('cy')),
        },
      }),
    );

    const hoveredNode = event.sourceEvent.target.parentNode.closest('.lnd__node');

    if (isOutsideSVG(svg, event.sourceEvent.clientX, event.sourceEvent.clientY)) {
      newLink.remove();
      return;
    }

    if (hoveredNode && sourceParentNode) {
      const hoveredNodeDatum = d3.select<SVGSVGElement, Node>(hoveredNode).datum();

      if (
        !isConnectionValid ||
        (isConnectionValid &&
          isConnectionValid(sourceParentNode.datum() as N & Node, hoveredNodeDatum as N & Node))
      )
        newLink.attr('d', () =>
          getLinkPath({
            start: {
              x: parentData.x,
              y: parentData.y,
              offsetX: parentData.width / 2,
              offsetY: parentData.height / 2,
            },
            end: {
              x: hoveredNodeDatum.x,
              y: hoveredNodeDatum.y,
              offsetX: hoveredNodeDatum.width / 2,
              offsetY: hoveredNodeDatum.height / 2,
            },
          }),
        );
    }
  }

  async function dragended(this: Element, event: any) {
    const hoveredNode = event.sourceEvent.target.parentNode.closest('.lnd__node');
    const hoveredNodeDatum = hoveredNode
      ? d3.select<SVGSVGElement, Node>(hoveredNode).datum()
      : undefined;

    if (
      hoveredNodeDatum &&
      parentData &&
      (isConnectionValid?.(parentData, hoveredNodeDatum as N & Node) ?? true)
    ) {
      try {
        await onNodesConnect?.(event, {
          id: Math.random(),
          source: { ...parentData } as N & Node,
          target: { ...hoveredNodeDatum } as N & Node,
        });
      } catch (e) {
        newLink?.remove();
        activeNodeObserver.setActiveNode(undefined);
      }
    }

    newLink?.remove();
    eventFlags.newLinkCreation = false;

    nodes.on('mouseleave', onNodeMouseLeave);
    activeNodeObserver.setActiveNode(undefined);
  }

  const connections = nodes.selectAll<SVGCircleElement, any>('.lnd__node__connection');
  connections.call(
    d3
      .drag<SVGCircleElement, any>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended),
  );
};
