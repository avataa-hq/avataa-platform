import * as d3 from 'd3';

import { addDragToNodes, addDragToConnectionPoints, addPanAndZoom } from './features';
import {
  drawNodeConnectionPoints,
  drawNodes,
  drawLinks,
  updateConnectionPointsVisibility,
  drawLinkIcons,
  setSvgDefs,
  drawLinkLabels,
} from './ui';
import {
  D3NodeSelection,
  activeNodeObserver,
  LinkedNodesDiagramData,
  LinkedNodesDiagramEvents,
  LinkedNodesDiagramOptions,
  InputNode,
} from './model';
import { setNodesWidthAndHeight } from './lib';
import { config } from './model/config';

export function generateLinkedNodesDiagram<N extends InputNode = InputNode>(
  { svgRef, nodes: inputNodesData, links: inputLinksData }: LinkedNodesDiagramData<N>,
  {
    onLinkAdd,
    onLinkIconClick,
    onNodeClick,
    onPanAndZoom,
    onNodeDragEnd,
  }: LinkedNodesDiagramEvents<N>,
  {
    viewBox = [0, 0, 640, 400],
    initialViewBox = [0, 0, 640, 400],
    minZoom = 0.5,
    maxZoom = 2.5,
    nodeSvgString,
    customNodeHtml,
    linkIcons,
    linkColor,
    linkOutlineColor,
    linkOpacity,
    linkWidth,
    linkDashArray,
    linkAnimatedDash,
    linkAnimatedCircle,
    linkIconWidth,
    isConnectionValid,
    getLinkIcon,
    getLinkLabel = config.defaultLinkLabelConfig,
    nodeFillColor,
    nodeWidth = 50,
    nodeHeight = 50,
    connectionPointFillColor,
    connectionPointStrokeColor,
    connectionPointStrokeWidth,
    newLinkColor = '#92ABFF',
    newLinkDashArray = [5, 5],
    newLinkOpacity = 1,
    newLinkWidth = 1.5,
    stopLinkIconRotation,
  }: LinkedNodesDiagramOptions<N> = {},
) {
  // Make a deep copy of nodes and links to be able to safely mutate their objects
  const nodesData = JSON.parse(JSON.stringify(inputNodesData));
  const linksData = JSON.parse(JSON.stringify(inputLinksData));

  const svg = d3
    .select(svgRef)
    .attr('style', 'width: 100%; height: 100%;')
    .attr('viewBox', viewBox)
    .attr('id', 'lnd__diagram')
    .attr('version', '2.0');

  const { defs, newLinkMarkerPath, linkMarkerPath } = setSvgDefs(svg);

  addPanAndZoom({ svg, initialViewBox, onPanAndZoom, minZoom, maxZoom });

  const { nodes: unpopulatedNodes, nodesGroup } = drawNodes<N>({
    nodesData,
    svg,
    nodeSvgString,
    customNodeHtml,
    fillColor: nodeFillColor,
    width: nodeWidth,
    height: nodeHeight,
    onClick: onNodeClick,
  });

  const nodes = setNodesWidthAndHeight<N>(
    // TODO: Fix TS error after removing `any`
    unpopulatedNodes as D3NodeSelection<any>,
    nodeWidth,
    nodeHeight,
  );
  if (onNodeClick)
    nodes.on('click', onNodeClick as NonNullable<LinkedNodesDiagramEvents['onNodeClick']>);

  const { links, linksGroup } = drawLinks({
    svg,
    linksData,
    linkMarkerPath,
    nodesData: nodes.data(),
    color: linkColor,
    opacity: linkOpacity,
    width: linkWidth,
    dashArray: linkDashArray,
    animatedDash: linkAnimatedDash,
    animatedCircle: linkAnimatedCircle,
    outlineColor: linkOutlineColor,
  });

  addDragToNodes<N>({
    svg,
    nodes,
    links,
    stopIconRotation: stopLinkIconRotation,
    isConnectionValid,
    onNodeDragEnd,
    getLinkLabel,
  });

  if (linkIcons)
    drawLinkIcons<N>({
      links,
      onClick: onLinkIconClick,
      icons: linkIcons,
      width: linkIconWidth,
      stopIconRotation: stopLinkIconRotation,
      getLinkIcon,
    });

  drawLinkLabels<N>({
    links,
    getLinkLabel,
  });

  drawNodeConnectionPoints<N>({
    nodes,
    fillColor: connectionPointFillColor,
    strokeColor: connectionPointStrokeColor,
    strokeWidth: connectionPointStrokeWidth,
  });
  addDragToConnectionPoints<N>({
    nodes,
    linksGroup,
    svg,
    newLinkMarkerPath,
    onNodesConnect: onLinkAdd,
    newLinkColor,
    newLinkDashArray,
    newLinkOpacity,
    newLinkWidth,
    isConnectionValid,
  });

  const handleActiveNodeChange = (activeNode?: D3NodeSelection<N>) =>
    updateConnectionPointsVisibility<N>({ nodes, activeNode, isConnectionValid });

  activeNodeObserver.subscribe<N>(handleActiveNodeChange);

  // Cleanup function. To be used when React component unmounts.
  function remove() {
    defs.remove();
    nodesGroup.remove();
    linksGroup.remove();
    activeNodeObserver.unsubscribe<N>(handleActiveNodeChange);
  }

  return { remove };
}
