import { DataflowDiagramNode } from '6_shared';
import { NewTransformationResponse } from '6_shared/api/dataview/types';

export const convertNewTransformationResponseToNode = ({
  name,
  rows_count,
  id,
  transform_type,
}: NewTransformationResponse): DataflowDiagramNode => {
  return {
    id,
    name,
    rows_count,
    transform_type,
    status: 'accepted',
    connections: {
      from: [],
      to: [],
    },
    x: 0,
    y: 0,
  };
};
