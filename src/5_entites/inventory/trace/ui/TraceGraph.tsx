import { Graph, IG6GraphEvent } from '@antv/g6';
import { Box, useTheme } from '@mui/material';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import { GetPathModel, GraphNodeObjectType, NodeByMoIdModel } from '6_shared';

import { useGetTraceGraphData, useTraceGraphConfig } from '../hooks';
import { NODE_PADDING, NODE_SIZE } from '../model/contants';

interface TraceGraphProps {
  pathData: GetPathModel | undefined;
  onNodeClick?: (node: NodeByMoIdModel) => void;
  graphRef?: React.MutableRefObject<Graph | null>;
  adaptiveHeight?: boolean;
  isDraggable?: boolean;
  isZoomable?: boolean;
}

export const TraceGraph = memo(
  ({
    pathData,
    onNodeClick,
    graphRef,
    adaptiveHeight = true,
    isDraggable,
    isZoomable,
  }: TraceGraphProps) => {
    const theme = useTheme();

    const tmoData = useMemo(() => {
      return (
        pathData?.tmo.reduce((acc, tmo) => {
          return { ...acc, [tmo.tmo_id]: tmo };
        }, {} as Record<string, GraphNodeObjectType>) ?? {}
      );
    }, [pathData?.tmo]);
    const getTraceGraphData = useGetTraceGraphData({ pathData, tmoData });
    const containerRef = useRef<HTMLDivElement>(null);

    const adjustedNodePadding = useMemo(() => {
      const longestLineNodeName = pathData?.nodes.reduce(
        (acc, node) =>
          tmoData[node.tmo]?.geometry_type === 'line' && node.name.length > acc.length
            ? node.name
            : acc,
        '',
      );

      if (!longestLineNodeName?.length) return NODE_PADDING;

      return longestLineNodeName.length * 6 + 20;
    }, [pathData?.nodes, tmoData]);

    const traceGraphConfig = useTraceGraphConfig(adjustedNodePadding);

    const handleNodeClick = useCallback(
      (e: IG6GraphEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const node = e.item?.getModel() as unknown as NodeByMoIdModel;
        onNodeClick?.(node);
      },
      [onNodeClick],
    );

    useEffect(() => {
      if (!containerRef.current) return () => {};

      const { edges, nodes } = getTraceGraphData();

      const graph = new Graph({
        container: containerRef.current,
        width: containerRef.current.scrollWidth,
        height: adaptiveHeight
          ? nodes.length * (NODE_SIZE + adjustedNodePadding)
          : containerRef.current.scrollHeight,
        ...traceGraphConfig,
        modes: {
          default: [
            ...(isDraggable ? ['drag-canvas'] : []),
            ...(isZoomable ? ['zoom-canvas'] : []),
            ...(traceGraphConfig.modes?.default ?? []),
          ],
        },
        fitCenter: nodes.length === 1 ? true : undefined,
      });

      graph.on('node:click', handleNodeClick);

      graph.on('edge:click', handleNodeClick);

      graph.read({
        nodes,
        edges,
      });
      graph.render();
      if (graphRef) graphRef.current = graph;

      return () => {
        graph.destroy();
        graph.off();
        if (graphRef) graphRef.current = null;
      };
    }, [
      adjustedNodePadding,
      getTraceGraphData,
      onNodeClick,
      theme.palette.text.primary,
      traceGraphConfig,
      graphRef,
      adaptiveHeight,
      isDraggable,
      isZoomable,
      handleNodeClick,
    ]);

    return (
      <Box
        component="div"
        height="100%"
        width="100%"
        display="flex"
        justifyContent="center"
        ref={containerRef}
      />
    );
  },
);
