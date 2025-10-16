import {
  IHierarchyAndInventoryResultInventoryBodyModel,
  IHierarchyAndInventoryResultInventoryBodyRangesItemModel,
  ISortColumn,
} from '6_shared';
import { useEffect, useState } from 'react';

export interface IInventoryBodyProps {
  withGroups?: boolean;
  limit?: number;
  offset?: number;
  sort?: ISortColumn[];

  rangesList?: IHierarchyAndInventoryResultInventoryBodyRangesItemModel[];
  rangesAggregationTprmId?: number | null;
  rangesAggregationType?: 'avg' | 'min' | 'max';
}

type BodyType = IHierarchyAndInventoryResultInventoryBodyModel | null;

export const useGetInventoryBody = ({
  sort,
  rangesList,
  offset,
  limit,
  withGroups,
  rangesAggregationTprmId,
  rangesAggregationType,
}: IInventoryBodyProps) => {
  const [body, setBody] = useState<BodyType>(null);
  const [copyRangesList, setCopyRangesList] = useState<
    IHierarchyAndInventoryResultInventoryBodyRangesItemModel[]
  >([]);

  useEffect(() => {
    setCopyRangesList((prev) => {
      if (rangesList && (!prev.length || prev.length < rangesList?.length)) {
        return rangesList;
      }

      return prev.map((item) => {
        const comingRange = rangesList?.find((rl) => rl.aggr_name === item.aggr_name);
        if (comingRange) {
          return comingRange;
        }
        return item;
      });
    });
  }, [rangesList]);

  useEffect(() => {
    const aggregation_by_ranges = copyRangesList.length
      ? {
          aggr_items: copyRangesList,
          aggr_by_tprm_id: rangesAggregationTprmId ?? undefined,
          aggregation_type: rangesAggregationType,
        }
      : undefined;

    const should_filter_conditions = rangesList?.map((r) => r.aggr_filters);

    setBody({
      limit,
      offset,
      sort_by: sort,
      with_groups: withGroups,
      return_results: true,
      aggregation_by_ranges,
      should_filter_conditions,
    });
  }, [
    limit,
    offset,
    rangesList,
    copyRangesList,
    sort,
    withGroups,
    rangesAggregationTprmId,
    rangesAggregationType,
  ]);

  return { inventoryBody: body };
};
