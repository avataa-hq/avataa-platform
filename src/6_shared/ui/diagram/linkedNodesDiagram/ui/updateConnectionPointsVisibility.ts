import * as d3 from 'd3';

import { D3NodeSelection, InputNode, LinkedNodesDiagramOptions, Node } from '../model';
import { getNodeConnectionPoints } from '../lib';

const points: Record<string, boolean> = {
  'lnd__node__connection-top': false,
  'lnd__node__connection-right': false,
  'lnd__node__connection-bottom': false,
  'lnd__node__connection-left': false,
};

const getUpdatedPoints = (
  pointsObject: Record<string, boolean>,
  connectionPoint: { x: number; y: number },
) => {
  const updatedPoints = { ...pointsObject };

  if (connectionPoint.x === 1) updatedPoints['lnd__node__connection-right'] = true;
  if (connectionPoint.x === -1) updatedPoints['lnd__node__connection-left'] = true;
  if (connectionPoint.y === 1) updatedPoints['lnd__node__connection-bottom'] = true;
  if (connectionPoint.y === -1) updatedPoints['lnd__node__connection-top'] = true;

  return updatedPoints;
};

export const updateConnectionPointsVisibility = <N extends InputNode = InputNode>({
  nodes,
  activeNode,
  radius = 5,
  isConnectionValid,
}: {
  nodes: D3NodeSelection<N>;
  activeNode?: D3NodeSelection<N>;
  radius?: number;
  isConnectionValid?: LinkedNodesDiagramOptions<N>['isConnectionValid'];
}) => {
  const activeNodeDatum = activeNode?.datum();
  let activeNodeVisiblePoints = points;

  nodes.each(function updateVisibility(d) {
    const nodeSelection = d3.select<SVGSVGElement, Node>(this);
    let visiblePoints = points;

    if (activeNode && activeNodeDatum) {
      if (
        activeNodeDatum.id === d.id ||
        (d.id !== activeNode.datum().id && activeNodeDatum.id !== activeNode.datum().id) ||
        (isConnectionValid && !isConnectionValid(activeNodeDatum as N & Node, d as N & Node))
      )
        return;

      const connectionPoints = activeNodeDatum
        ? getNodeConnectionPoints(activeNodeDatum, d)
        : [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ];

      activeNodeVisiblePoints = getUpdatedPoints(activeNodeVisiblePoints, connectionPoints[0]);
      visiblePoints = getUpdatedPoints(visiblePoints, connectionPoints[1]);
    }

    Object.entries(visiblePoints).forEach(([key, isVisible]) => {
      const selectedPoint = nodeSelection.select(`.${key}`);

      if (isVisible) {
        selectedPoint
          .attr('r', radius)
          .attr('opacity', 0)
          .transition()
          .duration(100)
          .attr('opacity', 1)
          .attr('pointer-events', 'all');
      } else {
        selectedPoint.transition().duration(100).attr('opacity', 0).attr('pointer-events', 'none');
      }
    });
  });

  if (!activeNode) return;

  Object.entries(activeNodeVisiblePoints).forEach(([key, isVisible]) => {
    const selectedPoint = activeNode.select(`.${key}`);

    if (isVisible) {
      selectedPoint
        .attr('r', radius)
        .attr('opacity', 0)
        .transition()
        .duration(100)
        .attr('opacity', 1)
        .attr('pointer-events', 'all');
    } else {
      selectedPoint.transition().duration(100).attr('opacity', 0).attr('pointer-events', 'none');
    }
  });
};
