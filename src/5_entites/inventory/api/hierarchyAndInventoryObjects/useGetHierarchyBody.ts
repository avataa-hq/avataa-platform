import { useEffect, useState } from 'react';
import {
  IHierarchyAndInventoryResultBody,
  IHierarchyAndInventoryResultFilters,
  IInventoryFilterModel,
} from '6_shared';

export interface IHierarchyBodyProps {
  hierarchyId?: number;
  parentHierarchyNodeId?: string;

  filters?: IHierarchyAndInventoryResultFilters[];

  aggregationTmoId?: number | null;
  aggregationTprmId?: number | null;
  aggregationType?: 'avg' | 'min' | 'max';

  selectedHierarchyItemId?: string | null;
  selectedHierarchyItemObjectId?: number | null;
  tmoIdBySelectedNonVirtualItem?: number | null;
}
type BodyType = Omit<IHierarchyAndInventoryResultBody, 'inventory_res'> | null;

export const useGetHierarchyBody = ({
  hierarchyId,
  parentHierarchyNodeId,
  filters,

  aggregationTmoId,
  aggregationTprmId,
  aggregationType,

  selectedHierarchyItemId,
  selectedHierarchyItemObjectId,
  tmoIdBySelectedNonVirtualItem,
}: IHierarchyBodyProps) => {
  const [body, setBody] = useState<BodyType>(null);
  const [bodyBySelectedNode, setBodyBySelectedNode] = useState<BodyType>(null);

  useEffect(() => {
    if (!hierarchyId || !parentHierarchyNodeId) return;

    const aggregation =
      aggregationTmoId && aggregationType && aggregationTprmId
        ? {
            aggregation_type: aggregationType,
            tmo_id: aggregationTmoId,
            tprm_id: aggregationTprmId,
          }
        : undefined;

    setBody({
      hierarchy_id: hierarchyId,
      parent_node_id: parentHierarchyNodeId,
      filters,
      aggregation,
    });
  }, [
    aggregationTmoId,
    aggregationType,
    aggregationTprmId,
    filters,
    hierarchyId,
    parentHierarchyNodeId,
  ]);

  useEffect(() => {
    if (!body) return;
    if (selectedHierarchyItemId) {
      setBodyBySelectedNode({ ...body, parent_node_id: selectedHierarchyItemId });
    }

    if (selectedHierarchyItemObjectId) {
      const getFilters = () => {
        const filterByObjectId: IInventoryFilterModel = {
          columnName: 'id',
          rule: 'and',
          filters: [{ operator: 'equals', value: String(selectedHierarchyItemObjectId) }],
        };
        if (!body.filters || !body.filters.length || !tmoIdBySelectedNonVirtualItem) return [];
        const [first, ...other] = body.filters;
        const newFirstFilter: IHierarchyAndInventoryResultFilters = {
          ...first,
          tmo_id: +tmoIdBySelectedNonVirtualItem,
          filter_columns: [...(first.filter_columns ?? []), filterByObjectId],
        };
        return [newFirstFilter, ...other];
      };
      setBodyBySelectedNode({ ...body, filters: getFilters() });
    }
  }, [body, selectedHierarchyItemId, selectedHierarchyItemObjectId, tmoIdBySelectedNonVirtualItem]);

  return { hierarchyBody: body, hierarchyBodyBySelectedNode: bodyBySelectedNode };
};
