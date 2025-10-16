import { Graph } from '@antv/x6';
import { useEffect, useState } from 'react';
import { GraphTmosWithColorRanges, IInventoryObjectModel } from '6_shared';
import {
  CablesSides,
  IConnectivityDiagramData,
  ICustomDiagramEdge,
  ICustomDiagramNode,
  IEdgeData,
} from '../modal/types';
import {
  balanceNodesByConnections,
  distributeEdgeVertices,
  distributionNodesOnSides,
  enrichNodesAndEdgesBySides,
  getCountedNumberOfConnections,
  getEdgesWithCorrectConnections,
} from '../lib/temp';
import { createNode } from '../lib/createNode';
import { getEdgesPaletteData } from '../lib';

const getSleeveSize = (
  cablesData: Record<CablesSides, ICustomDiagramNode[]>,
  padding: number = 10,
) => {
  const getSideSize = (side: CablesSides) => {
    const magnitude = side === 'left' || side === 'right' ? 'height' : 'width';
    return cablesData[side].reduce((acc, item) => {
      return acc + item[magnitude]!;
    }, padding * 2);
  };
  const leftHeight = getSideSize('left');
  const rightHeight = getSideSize('right');

  const topWidth = getSideSize('top');
  const bottomWidth = getSideSize('bottom');

  const height = Math.max(leftHeight, rightHeight);
  const width = Math.max(topWidth, bottomWidth);

  return { width, height };
};

const getGroupedEdges = (edges: ICustomDiagramEdge[]) => {
  const group: Record<string, ICustomDiagramEdge[]> = {};
  const edgeResult: ICustomDiagramEdge[] = [];
  edges.forEach((e) => {
    const { id } = e;
    if (!group[id]) group[id] = [];
    group[id].push(e);
  });
  Object.values(group).forEach((e) => {
    if (e.length === 1) edgeResult.push(e[0]);

    if (e.length === 2) {
      const [first, second] = e;

      edgeResult.push({
        ...first,
        source: {
          ...first.source,
          port: first.source?.port ?? second.source?.port,
          side: first.source?.side ?? second.source?.side,
        },
      });
    }
  });
  return edgeResult;
};

interface IAddEdgesToGraphProps {
  graph: Graph;
  edges: ICustomDiagramEdge[];
  strokeWidth?: number;
}

const addEdgesToGraph = ({ graph, edges, strokeWidth = 2 }: IAddEdgesToGraphProps) => {
  edges.forEach((e) => {
    const { sourceColor, targetColor, color, visible } = { ...e.data };

    let stroke: any = color ?? '#172a91';

    if (sourceColor && targetColor) {
      stroke = {
        type: 'linearGradient',
        stops: [
          { offset: '0%', color: sourceColor },
          { offset: '50%', color: sourceColor },
          { offset: '51%', color: targetColor },
          { offset: '100%', color: targetColor },
        ],
      };
    }

    const sourceNode = graph.getCellById(e.source?.cell!);
    const targetNode = graph.getCellById(e.target?.cell!);

    if (sourceNode && targetNode) {
      graph.addEdge({
        id: e.id,
        data: e.data,
        visible: visible == null ? true : visible,
        source: { cell: e.source?.cell!, port: e.source?.port! },
        target: { cell: e.target?.cell!, port: e.target?.port! },
        connector: {
          name: 'jumpover', // плавный поворот
          args: {
            radius: 7, // радиус для сгибания линии
            type: 'gap',
            size: 5,
          },
        },
        markup: [
          {
            tagName: 'path',
            selector: 'stroke',
          },
          {
            tagName: 'path',
            selector: 'fill',
          },
        ],
        attrs: {
          fill: {
            connection: false,
            strokeWidth,
            strokeLinecap: 'round',
            sourceMarker: null,
            fill: 'none',
            stroke,
            filter: {
              name: 'dropShadow',
              args: {
                dx: 1.5,
                dy: 2,
                blur: 2,
                color: 'rgb(0,0,0)',
                opacity: 0.5,
              },
            },
          },
        },
        router: {
          name: '',
          // name: '',
        },
      });
    }
  });
};

interface IProps {
  graphRef: React.MutableRefObject<Graph | null>;
  data: IConnectivityDiagramData | null;
  graphContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  colorRangesConfig: GraphTmosWithColorRanges;
  selectedObject?: IInventoryObjectModel | null;
}

export const useTryToBuild = ({
  graphRef,
  data,
  graphContainerRef,
  colorRangesConfig,
  selectedObject,
}: IProps) => {
  const [selectedObjects, setSelectedObjects] = useState<IInventoryObjectModel[]>([]);

  const [settings, setSettings] = useState({
    portSize: 30,
    sleeveBorderPadding: 400,
    sleeveOffsetBetweenCableX: 200,
    sleeveOffsetBetweenCableY: 200,
    paddingBetweenNode: 50,
  });

  useEffect(() => {
    if (!graphRef.current || !data || !graphContainerRef.current) return;
    const graph = graphRef.current;

    const { cableNodes, fibers, tableNode } = data;

    const tableRows = tableNode?.tableRows ?? [];

    const sleeveNode = graph.addNode({
      id: tableNode.key,
      shape: 'sleeve-node',
      x: 16596,
      y: 5799,
    });

    const edges = getEdgesWithCorrectConnections(tableRows, fibers, tableNode.key);
    const edgesMatrix = getCountedNumberOfConnections(edges);
    const edgesDistributed = balanceNodesByConnections(edgesMatrix, sleeveNode.id);

    const { nodesWithAdditionalDataBySide, edgesWithAdditionalData, nodeSize } =
      enrichNodesAndEdgesBySides({
        edges,
        sourceNodes: cableNodes,
        sleeveId: sleeveNode.id,
        nodesWithSides: edgesDistributed,
        portLabelColor: '#2b2b2b',
        portSize: settings.portSize,
      });

    const sleeveSize = getSleeveSize(nodesWithAdditionalDataBySide, settings.sleeveBorderPadding);
    sleeveNode.setSize(sleeveSize);

    const nodeWithPosition = distributionNodesOnSides({
      sleeveNode,
      cablesData: nodesWithAdditionalDataBySide,
      xOffset: settings.sleeveOffsetBetweenCableX,
      yOffset: settings.sleeveOffsetBetweenCableY,
      sleeveBorderPadding: settings.sleeveBorderPadding,
      offsetBetweenCable: settings.paddingBetweenNode,
      portSize: settings.portSize,
    });

    Object.values(nodeWithPosition).forEach((nodes) => {
      nodes.forEach((n) => {
        createNode({
          graph,
          shape: 'cable-node',
          ...n,
          fill: n.data.color,
          label: n.data.label,
          fontSize: n.width! / 10,
        });
      });
    });

    const groupedEdges = getGroupedEdges(edgesWithAdditionalData);

    const strokeWidth = nodeSize / 1000 < 0.5 ? 0.5 : nodeSize / 1000;

    addEdgesToGraph({ edges: groupedEdges, strokeWidth, graph });

    distributeEdgeVertices(graph, groupedEdges, sleeveNode);

    graph.on('node:change:position', () => {
      distributeEdgeVertices(graph, groupedEdges, sleeveNode);
    });

    setTimeout(() => {
      graph.zoomToFit({ padding: 50 });
    }, 1000);
  }, [
    graphRef,
    data,
    graphContainerRef,
    settings.portSize,
    settings.sleeveBorderPadding,
    settings.sleeveOffsetBetweenCableX,
    settings.sleeveOffsetBetweenCableY,
    settings.paddingBetweenNode,
  ]);

  useEffect(() => {
    if (!graphRef.current) return;
    const graph = graphRef.current;

    const graphEdges = graph.getEdges();
    const graphNodes = graph.getNodes();

    graphNodes.forEach((node) => {
      const tmoId = node?.data?.objectData?.tmo_id ?? -1;
      const paletteData = colorRangesConfig[String(tmoId)];
      if (paletteData) {
        node.updateData({ ...node.data, tmoPaletteData: paletteData });
      }
    });

    graphEdges.forEach((edge) => {
      const { newStroke, newVisible, newLineWidth } = getEdgesPaletteData(edge, colorRangesConfig);

      edge.setVisible(newVisible);
      edge.setAttrByPath(['fill', 'stroke'], newStroke);
      edge.setAttrByPath(['fill', 'strokeWidth'], newLineWidth);

      edge.updateData({ ...edge.data, strokeWidth: newLineWidth });
    });
  }, [colorRangesConfig, graphRef]);

  useEffect(() => {
    if (!graphRef.current) return;
    const graph = graphRef.current;

    const graphEdges = graph.getEdges();
    const selectedObjectIds = selectedObjects.map(({ id }) => id);
    graphEdges.forEach((edge) => {
      if (edge.data) {
        const { objectData, sourceObjectData, targetObjectData } = edge.data as IEdgeData;
        const currentObjectIds: number[] = [];
        if (objectData) currentObjectIds.push(objectData.id);
        if (sourceObjectData) currentObjectIds.push(sourceObjectData.id);
        if (targetObjectData) currentObjectIds.push(targetObjectData.id);
        const hasSelected = selectedObjectIds.some((id) => currentObjectIds.includes(id));

        const currentStrokeWith = edge.data?.strokeWidth ?? 2;

        if (hasSelected) {
          let multiple = 2.2;
          if (selectedObject && currentObjectIds.includes(selectedObject.id)) multiple = 4;
          edge.setAttrByPath(['fill', 'strokeWidth'], currentStrokeWith * multiple);
          edge.setAttrByPath(['fill', 'filter', 'opacity'], 1);
        } else {
          edge.setAttrByPath(['fill', 'strokeWidth'], currentStrokeWith);
          edge.setAttrByPath(['fill', 'filter', 'opacity'], 0.6);
        }
      }
    });
  }, [graphRef, selectedObjects, selectedObject]);

  useEffect(() => {
    graphRef.current?.on('edge:click', ({ edge }) => {
      if (edge.data) {
        const edgeData = edge.data as IEdgeData;
        const { objectData, sourceObjectData, targetObjectData } = edgeData;
        setSelectedObjects((prev) => {
          const objectToAdd: IInventoryObjectModel[] = [];
          if (sourceObjectData) {
            const hasSame = !!prev.find(({ id }) => id === sourceObjectData.id);
            if (!hasSame) objectToAdd.push(sourceObjectData);
          }
          if (targetObjectData) {
            const hasSame = !!prev.find(({ id }) => id === targetObjectData.id);
            if (!hasSame) objectToAdd.push(targetObjectData);
          }

          if (!sourceObjectData && !targetObjectData && objectData) {
            const hasSame = !!prev.find(({ id }) => id === objectData.id);
            if (!hasSame) objectToAdd.push(objectData);
          }
          return prev.concat(objectToAdd);
        });
      }
    });
    graphRef.current?.on('edge:contextmenu', ({ edge }) => {
      if (edge.data) {
        const edgeData = edge.data as IEdgeData;
        const { objectData, sourceObjectData, targetObjectData } = edgeData;
        const filterIds: number[] = [];

        if (sourceObjectData) filterIds.push(sourceObjectData.id);
        if (targetObjectData) filterIds.push(targetObjectData.id);
        if (objectData) filterIds.push(objectData.id);
        setSelectedObjects((prev) => prev.filter(({ id }) => !filterIds.includes(id)));
      }
    });

    return () => {
      graphRef.current?.off();
    };
  }, [graphRef]);

  return { settings, setSettings, selectedObjects, setSelectedObjects };
};
