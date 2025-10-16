import { CustomEdgeConfig } from '6_shared';
import { IEdge } from '@antv/g6';

export const getObjectId = (newClickedEdge: IEdge) => {
  const clickedEdgeModel = { ...(newClickedEdge.getModel() as CustomEdgeConfig) };

  if (newClickedEdge._cfg && typeof newClickedEdge._cfg.source === 'object') {
    const sourceCfg = newClickedEdge._cfg.source;
    if (sourceCfg._cfg && sourceCfg._cfg.model && sourceCfg._cfg.model.tableRows) {
      const { tableRows } = sourceCfg._cfg.model;
      if (tableRows && Array.isArray(tableRows) && tableRows.length) {
        const object = tableRows.find(
          (item: any) =>
            item.key === clickedEdgeModel.sourceKey || item.key === clickedEdgeModel.targetKey,
        );

        if (object && object.objectId) {
          const { objectId } = object;
          return typeof objectId === 'number' ? objectId : +objectId;
        }
      }
    }
  }

  return null;
};
