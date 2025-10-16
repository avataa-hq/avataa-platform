import { GetPathModel, GraphNodeObjectType, NodeByMoIdModel } from '6_shared';
import { lineTypeDefinitions } from '6_shared/ui/lineSvg/lib/lineTypeDefinitions';
import { EdgeConfig, NodeConfig } from '@antv/g6';
import { Util } from '@antv/g6-core';
import { alpha, useTheme } from '@mui/material';
import { useCallback } from 'react';
import { useGetRangeColor } from './useGetRangeColor';
import { filterDuplicatedEdges } from '../../graph/builder';

const transformNodeLabel = (node: any) => {
  // @ts-ignore
  const nodeLabel = node.label;
  if (nodeLabel.length <= 10) {
    return nodeLabel;
  }

  let newLabel = '';
  const lastCharIndex = nodeLabel.length - 1;
  let charsBeforeBreak = 0;
  for (let i = 0; i < nodeLabel.length; i++) {
    newLabel += nodeLabel[i];
    if (nodeLabel[i] === ' ' && i + 1 !== lastCharIndex) {
      if (charsBeforeBreak > 6) {
        const lastSpaceIndex = newLabel.lastIndexOf(' ');
        newLabel = `${newLabel.substring(0, lastSpaceIndex)}\n${newLabel.substring(
          lastSpaceIndex + 1,
        )}`;
        charsBeforeBreak = i - lastSpaceIndex - 1;
      }
    } else {
      charsBeforeBreak++;
    }
  }
  return newLabel;
};

interface Props {
  pathData: GetPathModel | undefined;
  tmoData: Record<string, GraphNodeObjectType>;
}

export const useGetTraceGraphData = ({ pathData, tmoData }: Props) => {
  const theme = useTheme();
  const { getRangeColor } = useGetRangeColor({
    tmo_ids: pathData?.tmo.map((tmo) => tmo.tmo_id.toString()),
    tprm_ids: pathData?.nodes.flatMap((item) =>
      item.data?.params ? item.data?.params?.map((param) => param.tprm_id.toString()) : [],
    ),
  });

  const getTraceGraphData = useCallback(() => {
    const nodes: NodeConfig[] = [];
    const edges: EdgeConfig[] | undefined = pathData?.edges.map((e) => ({ ...e, id: e.key }));
    const nodeIds = new Set();

    const nodesWithUniqueIds: (NodeByMoIdModel & NodeConfig)[] =
      pathData?.nodes.flatMap((n, i) => {
        let nodeId = n.key;

        if (!nodeIds.has(n.key)) {
          nodeIds.add(n.key);
        } else {
          nodeId = `${n.key}_${i}`;
          nodeIds.add(nodeId);

          const nodeEdges =
            edges
              ?.filter((e) => e.source === n.key || e.target === n.key)
              .map((e) => {
                if (e.source === n.key) {
                  return { ...e, source: nodeId, id: `${e.key}_${nodeId}_${e.target}` };
                }
                return { ...e, target: nodeId, id: `${e.key}_${e.source}_${nodeId}` };
              }) ?? [];

          edges?.push(...nodeEdges);
        }

        const objectName = n.label && n.label !== '' ? n.label : n.name;
        return { ...n, id: nodeId, label: objectName, degree: -i, muiIcon: tmoData[n.tmo]?.icon };
      }) ?? [];

    nodesWithUniqueIds.flatMap((n, i, arr) => {
      if (tmoData[n.tmo]?.geometry_type === null || tmoData[n.tmo]?.geometry_type === 'point') {
        nodes.push({
          ...n,
          label: transformNodeLabel(n),
        });
      }

      if (tmoData[n.tmo]?.geometry_type === 'line') {
        const isFirst = i === 0;
        const isLast = i === arr.length - 1;
        const emptyNode: Omit<NodeConfig, 'id'> = { style: { opacity: 0 } };

        const { dasharray } = lineTypeDefinitions[tmoData[n.tmo]?.line_type ?? 'solid'];

        const prevNode = arr[i - 1];
        const currentNode = arr[i];
        const nextNode = arr[i + 1];

        const currentNodeEdges = pathData?.edges.filter(
          (edge) => edge.source === currentNode.key || edge.target === currentNode.key,
        );

        if (
          currentNodeEdges?.length === 2 &&
          tmoData[prevNode.tmo]?.geometry_type === 'point' &&
          tmoData[nextNode.tmo]?.geometry_type === 'point' &&
          (currentNodeEdges[0].connection_type === 'point_a' ||
            currentNodeEdges[0].connection_type === 'point_b') &&
          (currentNodeEdges[1].connection_type === 'point_a' ||
            currentNodeEdges[1].connection_type === 'point_b')
        ) {
          const newEdge: EdgeConfig = {
            ...n,
            source: isFirst ? 'firstNode' : prevNode?.key,
            target: isLast ? 'lastNode' : nextNode?.key,
            style: {
              stroke: getRangeColor(n) ?? theme.palette.primary.main,
              lineWidth: 3,
              lineDash: dasharray.split(',').map((item) => parseInt(item.trim(), 10)),
            },
          };

          edges?.push(newEdge);

          edges?.forEach((edge, index) => {
            if (edge.source === currentNode.key || edge.target === currentNode.key) {
              edges.splice(index, 1);
            }
          });
        } else {
          const newNode = {
            ...n,
            label: transformNodeLabel(n),
            degree: -i,
            muiIcon: tmoData[n.tmo]?.icon,
          };
          nodes.push(newNode);
        }

        if (isFirst) return { ...emptyNode, id: 'firstNode', degree: 1 };
        if (isLast) return { ...emptyNode, id: 'lastNode', degree: -i - 1 };

        return [];
      }

      const nodeColor = getRangeColor(n) ?? theme.palette.primary.main;

      return { ...n, style: { fill: nodeColor, stroke: alpha(nodeColor, 0.3) } };
    });

    // const firstNode = nodes[0];
    // const lastNode = nodes[nodes.length - 1];

    // const { dasharray } = lineTypeDefinitions.dashed;

    // if (firstNode && lastNode) {
    //   const newEdge = {
    //     source: firstNode.id,
    //     target: lastNode.id,
    //     connection_type: 'p_id',
    //     id: 'unique-edge-id',
    //     key: 'unique-edge-key',
    //     prm: null,
    //     source_object: null,
    //     tprm: null,
    //     virtual: false,
    //     type: 'arc',
    //     style: {
    //       stroke: theme.palette.primary.main,
    //       lineWidth: 2,
    //       lineDash: dasharray.split(',').map((item) => parseInt(item.trim(), 10)),
    //       curveOffset: 200,
    //       curvePosition: 0.5,
    //       preventOverlap: true,
    //     },
    //   };

    //   edges?.push(newEdge);
    // }

    const edgesWithoutDuplicate = edges ? filterDuplicatedEdges(edges) : [];
    Util.processParallelEdges(edgesWithoutDuplicate, 40);

    return { nodes, edges: edgesWithoutDuplicate };
  }, [getRangeColor, pathData?.edges, pathData?.nodes, theme.palette.primary.main, tmoData]);

  return getTraceGraphData;
};
