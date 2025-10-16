import { PipelineStructure } from '6_shared/api/dataview/types';
import { DataflowDiagramNode, Link } from '6_shared';

export const convertPipelineStructureToDiagramData = (
  pipelineStructure: PipelineStructure,
): { nodes: DataflowDiagramNode[]; links: Link[] } => {
  const links: Link[] = pipelineStructure.relations.map(({ id, child, parent, root }) => ({
    id,
    source: parent,
    target: child,
    root,
  }));

  const nodes: DataflowDiagramNode[] = pipelineStructure.sources.map((source) => ({
    ...source,
    connections: {
      from: pipelineStructure.relations.filter((l) => l.child === source.id).map((l) => l.parent),
      to: pipelineStructure.relations.filter((l) => l.parent === source.id).map((l) => l.child),
    },
  }));

  return { nodes, links };
};
