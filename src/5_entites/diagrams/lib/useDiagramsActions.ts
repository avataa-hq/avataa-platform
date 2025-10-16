import { useCallback } from 'react';
import { Graph3000Data, GraphData, useDiagramsPage } from '6_shared';

export const useDiagramsActions = () => {
  const { setGraphInitialData, setIsLoadingDiagram, setSelectedDiagram } = useDiagramsPage();

  const setGraphInitialDataAction = useCallback((data: Graph3000Data | null) => {
    setGraphInitialData(data);
  }, []);

  const setIsLoadingDiagramAction = useCallback((value: boolean) => {
    setIsLoadingDiagram(value);
  }, []);

  const setSelectedDiagramAction = useCallback((data: GraphData | null) => {
    setSelectedDiagram(data);
  }, []);

  return {
    setGraphInitialData: setGraphInitialDataAction,
    setIsLoadingDiagram: setIsLoadingDiagramAction,
    setSelectedDiagram: setSelectedDiagramAction,
  };
};
