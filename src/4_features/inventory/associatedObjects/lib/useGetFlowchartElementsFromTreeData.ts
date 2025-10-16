import { useCallback } from 'react';
import { BuiltInEdge, Edge, MarkerType, Node } from '@xyflow/react';
import { AllChildrenResponse } from '6_shared';

export const useGetFlowchartElementsFromTreeData = () => {
  const getNodesFromTreeData = useCallback(
    (tree: AllChildrenResponse, rootObjectId: number, nodes: Node[] = []): Node[] => {
      if (!tree) return [];

      nodes.push({
        id: String(tree.object_id),
        type: 'treeDataNode',
        data: {
          label: tree.object_name,
          isRootParentObject: tree.object_id === rootObjectId,
          hasChildren: tree.children?.length > 0,
        },
        position: { x: 0, y: 0 },
      });

      tree.children.forEach((child) => {
        getNodesFromTreeData(child, rootObjectId, nodes);
      });

      return nodes;
    },
    [],
  );

  const getEdgesFromTreeData = useCallback((tree: AllChildrenResponse): Edge[] => {
    const edges: (Edge & BuiltInEdge)[] = [];

    const transform = (object: AllChildrenResponse): void => {
      const { object_id, children } = object;

      if (children && children.length > 0) {
        children.forEach((child: AllChildrenResponse) => {
          edges.push({
            id: `${object_id}-${child.object_id}`,
            source: object_id.toString(),
            target: child.object_id.toString(),
            type: 'straight',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          });

          transform(child);
        });
      }
    };

    transform(tree);
    return edges;
  }, []);

  return { getNodesFromTreeData, getEdgesFromTreeData };
};
