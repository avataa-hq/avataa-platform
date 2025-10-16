import { AllChildrenResponse } from '6_shared';
import { Background, Controls, type Node, useNodesState, Edge, useEdgesState } from '@xyflow/react';
import { useEffect } from 'react';
import { useTheme } from '@mui/material';
import { createRadialLayout, useGetFlowchartElementsFromTreeData } from '../../lib';
import { TreeDataNode } from './TreeDataNode';
import { ChildrenFlowchartStyled } from './ChildrenFlowchart.styled';

interface IProps {
  childObjects?: AllChildrenResponse;
}

export const ChildrenFlowchart = ({ childObjects }: IProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const nodeTypes = { treeDataNode: TreeDataNode };

  const theme = useTheme();

  const { getNodesFromTreeData, getEdgesFromTreeData } = useGetFlowchartElementsFromTreeData();

  useEffect(() => {
    if (!childObjects) return;
    const nodePositions = createRadialLayout(childObjects);

    const nodesFromTreeData = getNodesFromTreeData(childObjects, childObjects.object_id);
    const radialNodes = nodesFromTreeData.map((node) => ({
      ...node,
      position: nodePositions[node.id],
    }));

    const edgesFromTreeData = getEdgesFromTreeData(childObjects);

    setNodes(radialNodes);
    setEdges(edgesFromTreeData);
  }, [childObjects, setEdges, setNodes, getEdgesFromTreeData, getNodesFromTreeData]);

  const proOptions = { hideAttribution: true };

  return (
    <ChildrenFlowchartStyled
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      fitView
      proOptions={proOptions}
      minZoom={0.05}
      maxZoom={2}
    >
      <Background
        color={theme.palette.components.reactFlow.flowChartBackground}
        style={{ backgroundColor: theme.palette.components.reactFlow.flowChartBackground }}
      />
      <Controls />
    </ChildrenFlowchartStyled>
  );
};
