import { CustomNodeConfig } from '6_shared';
import {
  CablesSides,
  IBalanceNodesConnections,
  ICustomDiagramEdge,
  ICustomDiagramNode,
  INodeData,
} from '../../modal/types';
import { getSortedPorts } from './getSortedPorts';

const getEdgeLabel = (edge: ICustomDiagramEdge, type: 'source' | 'target') => {
  if (!edge.data) return '';
  let resultLabel = edge.data.label ?? '';
  if (type === 'source' && edge.data.sourceLabel) {
    resultLabel = edge.data.sourceLabel;
  }
  if (type === 'target' && edge.data.targetLabel) {
    resultLabel = edge.data.targetLabel;
  }
  return resultLabel;
};

const getNodeData = (node: CustomNodeConfig) => {
  const { label, name, color } = node;

  const correctLabel = typeof label === 'string' ? label : undefined;
  const resultLabel = correctLabel ?? name ?? '';

  return {
    label: resultLabel,
    color,
  };
};

const getOffset = (side: CablesSides) => {
  const offset = 10;
  if (side === 'bottom' || side === 'top') return { x: offset + 2 };
  return { y: -offset };
};

interface IProps {
  nodesWithSides: IBalanceNodesConnections;
  sourceNodes: CustomNodeConfig[];
  edges: ICustomDiagramEdge[];
  sleeveId: string;

  portSize?: number;
  portLabelColor?: string;
}

export const enrichNodesAndEdgesBySides = ({
  nodesWithSides,
  sourceNodes,
  edges,
  sleeveId,
  portSize = 10,
  portLabelColor,
}: IProps): {
  nodesWithAdditionalDataBySide: Record<CablesSides, ICustomDiagramNode[]>;
  edgesWithAdditionalData: ICustomDiagramEdge[];
  nodeSize: number;
} => {
  const sidesNodes = Object.values(nodesWithSides).flat();
  let nodeSize = 100;

  const edgesMap = new Map<string, ICustomDiagramEdge>();
  const sourceNodeMap = new Map(sourceNodes.map((node) => [node.key, node]));

  const addEdgeData = (
    edge: ICustomDiagramEdge,
    type: 'source' | 'target',
    node: ICustomDiagramNode,
  ) => {
    const portId = `${type}-${edge.id}-port`;
    const updatedEdge = edgesMap.get(edge.id) || { ...edge };

    updatedEdge[type] = {
      cell: node.id,
      port: portId,
      side: node.side,
    };

    edgesMap.set(edge.id, updatedEdge);

    return {
      group: node.side,
      id: portId,
      label: {
        position: {
          name: 'outsideOriented',
          args: {
            ...getOffset(node.side ?? 'left'),
            attrs: {
              text: {
                fill: portLabelColor,
              },
            },
          },
        },
      },
      attrs: {
        text: {
          fontSize: portSize > 15 ? 15 : portSize,
          text: getEdgeLabel(edge, type),
        },
      },
    };
  };

  const nodesBySide: Record<CablesSides, ICustomDiagramNode[]> = {
    left: [],
    right: [],
    top: [],
    bottom: [],
  };

  sidesNodes.forEach((node) => {
    const exNode = sourceNodeMap.get(node.id);
    if (!exNode) return;
    const portItems: any[] = [];
    edges.forEach((edge) => {
      if (edge.source?.cell === node.id) {
        portItems.push(addEdgeData(edge, 'source', node));
      }
      if (edge.target?.cell === node.id) {
        portItems.push(addEdgeData(edge, 'target', node));
      }
    });

    const sortedPort = getSortedPorts(portItems, edges, sleeveId);

    const sizeBasedPortsCount = sortedPort.length * portSize;
    nodeSize = Math.max(nodeSize, sizeBasedPortsCount);

    const nodeModelData = getNodeData(exNode);

    const nodeData: INodeData = {
      label: nodeModelData.label,
      color: nodeModelData.color,
      portSide: node.side,
    };

    const resultNode = {
      ...node,
      data: nodeData,
      width: sizeBasedPortsCount,
      height: sizeBasedPortsCount,
      ports: {
        items: sortedPort,
        groups: {
          [node.side as string]: {
            position: { name: node.side, args: { dx: 0, dy: 0 } },
            attrs: {
              circle: {
                r: 2,
                magnet: false,
                stroke: '#502e2e',
                fill: '#000000',
                strokeWidth: 0,
              },
            },
          },
        },
      },
    };

    nodesBySide[node.side as CablesSides].push(resultNode);
  });

  return {
    nodesWithAdditionalDataBySide: nodesBySide,
    edgesWithAdditionalData: Array.from(edgesMap.values()),
    nodeSize,
  };
};
