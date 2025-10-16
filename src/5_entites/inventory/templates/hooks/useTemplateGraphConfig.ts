import { useMemo } from 'react';
import { type Edge, useEdgesState, useNodesState, MarkerType } from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import { IObjectTemplateModel, IObjectTemplateObjectModel } from '6_shared';
import { CustomNode } from '../ui/templateGraph/CustomNode';
import { ICustomTemplateGraphNode, NODE_HEIGHT, NODE_WIDTH } from '../model';

interface IProps {
  templateObjectsData: IObjectTemplateObjectModel[] | undefined;
  selectedTemplate: IObjectTemplateModel | null;
  objectTypeHashNames: Record<number, string>;
}

export const useTemplateGraphConfig = ({
  templateObjectsData,
  selectedTemplate,
  objectTypeHashNames,
}: IProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<ICustomTemplateGraphNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const nodeTypes = {
    custom: CustomNode,
  };

  useMemo(() => {
    if (!templateObjectsData || !selectedTemplate) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const buildFlowElements = (
      tree: IObjectTemplateObjectModel[],
      templateParentId: number | null = null,
    ) => {
      const newNodes: ICustomTemplateGraphNode[] = [];
      const newEdges: Edge[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const item of tree) {
        // Create nodes
        newNodes.push({
          id: item.id.toString(),
          data: {
            label: objectTypeHashNames[item.object_type_id],
            object_type_id: item.object_type_id,
            isValid: !item.parameters.some((p) => !p.valid),
            isParent: !templateParentId,
          },
          position: { x: 0, y: 0 },
          type: 'custom',
        });

        // If has parent create edge
        if (templateParentId) {
          newEdges.push({
            id: `${templateParentId}-${item.id}`,
            source: templateParentId.toString(),
            target: item.id.toString(),
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          });
        }

        // Recursive call for children
        if (item.children && item.children.length > 0) {
          const { nodes: childNodes, edges: childEdges } = buildFlowElements(
            item.children,
            item.id,
          );
          newNodes.push(...childNodes);
          newEdges.push(...childEdges);
        }
      }

      return { nodes: newNodes, edges: newEdges };
    };

    const getLayoutedElements = (
      newNodes: ICustomTemplateGraphNode[],
      newEdges: Edge[],
      direction: 'TB' | 'LR' = 'TB', // TB = top-bottom, LR = left-right
    ) => {
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));

      // const isHorizontal = direction === 'LR';

      dagreGraph.setGraph({ rankdir: direction, nodesep: 80, ranksep: 80 });

      newNodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
      });

      newEdges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      newNodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        node.position = {
          x: nodeWithPosition.x - NODE_WIDTH / 2,
          y: nodeWithPosition.y - NODE_HEIGHT / 2,
        };
      });

      return { nodes: newNodes, edges: newEdges };
    };

    const { nodes: templateNodes, edges: templateEdges } = buildFlowElements(templateObjectsData);

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      templateNodes,
      templateEdges,
      'TB',
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [templateObjectsData, selectedTemplate, setNodes, setEdges, objectTypeHashNames]);

  return { nodes, edges, onNodesChange, onEdgesChange, nodeTypes };
};
