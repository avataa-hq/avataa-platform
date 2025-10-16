import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';
import { useGetNodeBuild } from '../node/useGetNodeBuild';

interface IProps {
  containerRef: MutableRefObject<HTMLDivElement | null>;
}

export const useGetDiagram = ({ containerRef }: IProps) => {
  const connectivityDiagramRef = useRef<Graph | null>(null);

  const getNodeBuild = useGetNodeBuild();
  getNodeBuild();

  const getDiagramInstance = useCallback((container: HTMLDivElement) => {
    if (connectivityDiagramRef.current) return connectivityDiagramRef.current;
    const graph = new Graph({
      container,
      grid: true,
      autoResize: true,
      panning: true,
      mousewheel: true,
      background: {
        color: '#fff',
      },
      interacting: {
        nodeMovable: false,
        edgeMovable: false,
      },
    });
    connectivityDiagramRef.current = graph;
    return graph;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return () => null;
    const graph = getDiagramInstance(containerRef.current);

    return () => {
      graph.clearGrid();
      graph.clearBackground();
      graph.clearCells();
      connectivityDiagramRef.current = null;
    };
  }, [containerRef, getDiagramInstance]);
  return { connectivityDiagramRef };
};
