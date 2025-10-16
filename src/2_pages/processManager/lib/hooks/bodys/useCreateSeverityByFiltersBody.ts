import { useEffect, useState } from 'react';
import { ColumnFilter, GetSeverityByFiltersBody, IFilterSetModelItem } from '6_shared';
import { transformFilterSet } from '5_entites';
import { HierarchyObject } from '6_shared/api/hierarchy/types';

const defaultFilter: ColumnFilter = {
  columnName: 'state',
  rule: 'and',
  filters: [{ operator: 'equals', value: 'ACTIVE' }],
};
const mergedColumnFilters = (filterSet: IFilterSetModelItem | null) => {
  const transformedFilters = transformFilterSet(filterSet);
  const filtersList = transformedFilters ? [...transformedFilters, defaultFilter] : [defaultFilter];
  return filtersList;
};

interface IProps {
  filterSets?: IFilterSetModelItem[];
  skip?: boolean;
  severityDirection: 'asc' | 'desc';
  parentItems: HierarchyObject[];
  childItems: HierarchyObject[];
  selectedGroup?: string | null;
}
export const useCreateSeverityByFiltersBody = ({
  filterSets,
  severityDirection,
  parentItems,
  childItems,
  selectedGroup,
}: IProps) => {
  const [severityByFiltersBody, setSeverityByFiltersBody] = useState<GetSeverityByFiltersBody[]>(
    [],
  );

  useEffect(() => {
    if (!filterSets || !filterSets?.length) return;
    const rqBody: GetSeverityByFiltersBody[] = [...filterSets].map((filter) => {
      return {
        columnFilters: mergedColumnFilters(filter) || undefined,
        filterName: filter.name,
        tmoId: filter.tmo_info.id || undefined,
        severity_direction: severityDirection,
      };
    });

    if (rqBody.length) setSeverityByFiltersBody(rqBody);
  }, [filterSets, severityDirection, selectedGroup]);

  useEffect(() => {
    if (!childItems.length && !parentItems.length) return;
    const all = [...childItems, ...parentItems];
    const rqBody: GetSeverityByFiltersBody[] = all.flatMap((i) => {
      if (i.object_type_id == null || i.id === 'root') return [];

      return {
        filterName: i.id,
        tmoId: i.object_type_id,
        severity_direction: severityDirection,
        columnFilters: [defaultFilter],
      };
    });
    if (rqBody.length) setSeverityByFiltersBody(rqBody);
  }, [childItems, parentItems, severityDirection]);

  return { severityByFiltersBody };
};
