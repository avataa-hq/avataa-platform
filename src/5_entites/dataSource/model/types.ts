import { ActionTypes } from '6_shared';
import { Pipeline } from '6_shared/api/dataview/types';

export interface GetPipelinesTableColumnsProps {
  onInfoClick: (item: Pipeline, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onHistoryClick: (item: Pipeline, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  selectedTags: Record<string, boolean> | null;
  handlePipelineTagClick: (tag: string) => void;
  permissions?: Record<ActionTypes, boolean>;
}
