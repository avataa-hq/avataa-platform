import { useCallback } from 'react';
import { PipelineStructure } from '6_shared/api/dataview/types';
import { convertPipelineStructureToDiagramData } from '5_entites/dataflowDiagram/lib';
import { useDataflowDiagram, useDataflowDiagramPage } from '6_shared';

export const useDisplayPipeline = () => {
  const {
    setIsDiagramChanged,
    setLinks,
    setNodes,
    setPipelineId,
    setPipelineName,
    setPipelineSchedule,
    setPipelineTags,
  } = useDataflowDiagram();
  const { setIsDataflowDiagramOpen } = useDataflowDiagramPage();

  const displayPipeline = useCallback((pipelineStructure: PipelineStructure) => {
    setPipelineId(pipelineStructure.id);
    setPipelineName(pipelineStructure.name);
    setPipelineSchedule(pipelineStructure.schedule);
    setPipelineTags(pipelineStructure.tags);

    const { nodes, links } = convertPipelineStructureToDiagramData(pipelineStructure);
    setNodes(nodes);
    setLinks(links);
    if (nodes.some((node) => node.status === 'deleted' || node.status === 'waiting'))
      setIsDiagramChanged(true);

    setIsDataflowDiagramOpen(true);
  }, []);

  return displayPipeline;
};
