import { IEdge, IG6GraphEvent } from '@antv/g6';
import { enqueueSnackbar } from 'notistack';
import {
  getErrorMessage,
  CollapsedEdgeConfig,
  CustomEdgeConfig,
  DEFAULT_EDGE_TYPE,
  TABLE_NODE_EDGE_TYPE,
} from '6_shared';
import { Graph3000, processParallelEdges } from '../../../builder';

export const onGraphEdgeMouseClick = (
  event: IG6GraphEvent,
  graph?: Graph3000,
  objectId?: number | null,
) => {
  try {
    const clickedEdge = event.item as IEdge;
    const clickedEdgeModel = { ...(event.item?.getModel() as CustomEdgeConfig) };

    if (clickedEdgeModel.type === TABLE_NODE_EDGE_TYPE && !objectId) {
      graph?.expandTableEdge(clickedEdge);
      graph?.collapseTableEdge(clickedEdge);
      return;
    }

    if (clickedEdgeModel.connectionType === 'geometry_line') {
      graph?.expandEdge(clickedEdge);
      return;
    }

    if (clickedEdgeModel.connectionType === 'collapsed') {
      const childEdges = processParallelEdges(clickedEdgeModel.childEdges);

      graph?.addEdgesToGraph(childEdges as CustomEdgeConfig[]);
      graph?.hideItem(clickedEdge);
    } else if (clickedEdgeModel.type === DEFAULT_EDGE_TYPE && clickedEdgeModel.parentEdgeId) {
      const parentEdge = graph?.findById(clickedEdgeModel.parentEdgeId);
      if (parentEdge) {
        const parentEdgeModel = parentEdge.getModel() as CollapsedEdgeConfig;
        parentEdgeModel.childEdges.forEach((edge) => {
          if (edge.id) graph?.removeItem(edge.id);
        });
        graph?.showItem(parentEdge);
      }
    }
  } catch (error) {
    console.error(error);
    enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
  }
};
