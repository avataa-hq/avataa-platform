import { useEffect, useMemo, useState } from 'react';
import {
  FILTER_VALUE_SEPARATOR,
  IFilterSetModel,
  IKanbanStatus,
  InventoryObjectTypesModel,
} from '6_shared';
import { useGetParamTypeById } from '5_entites';

interface IProps {
  pmCurrentTmo: InventoryObjectTypesModel | null;
  selectedMultiFilter: IFilterSetModel | null;
}

export const useKanbanStatus = ({ pmCurrentTmo, selectedMultiFilter }: IProps) => {
  const [statusTprmId, setStatusTprmId] = useState<number | null>(null);
  const [isActiveKanban, setIsActiveKanban] = useState(false);
  const [kanbanStatuses, setKanbanStatuses] = useState<IKanbanStatus[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<IKanbanStatus[]>([]);

  const { paramTypeData } = useGetParamTypeById({ tprmId: statusTprmId });

  useEffect(() => {
    if (pmCurrentTmo) {
      setStatusTprmId(pmCurrentTmo.status);
      setIsActiveKanban(pmCurrentTmo.status !== null && paramTypeData?.val_type === 'enum');
    }
  }, [paramTypeData?.val_type, pmCurrentTmo]);

  useEffect(() => {
    if (paramTypeData?.constraint && paramTypeData.val_type === 'enum') {
      try {
        const parsedConstraint = JSON.parse(paramTypeData.constraint.replace(/'/g, '"'));
        const newKanbanStatuses: IKanbanStatus[] = Array.isArray(parsedConstraint)
          ? parsedConstraint.map((item) => ({
              id: item,
              name: item,
              tprmId: paramTypeData.id,
            }))
          : [];

        setKanbanStatuses(newKanbanStatuses);
      } catch (error) {
        console.error('Error parsing constraint:', error);
      }
    }
  }, [paramTypeData]);

  useEffect(() => {
    if (selectedMultiFilter && statusTprmId !== null) {
      const statusFilters = selectedMultiFilter.filters.filter(
        (filter) => filter.column.id === String(statusTprmId),
      );

      if (statusFilters.length > 0) {
        const statusValues = statusFilters.flatMap((filter) =>
          filter.filters.map((f) => String(f.value)),
        );

        const formattedStatuses: IKanbanStatus[] = statusValues
          .join(',')
          // .split(/[бля,]+/)
          .split(new RegExp(`[${FILTER_VALUE_SEPARATOR},]+`))
          .map((s) => s.trim())
          .filter(Boolean)
          .map((status) => ({
            id: status,
            name: status,
            tprmId: statusTprmId,
          }));

        setFilteredStatuses(formattedStatuses);
      } else {
        setFilteredStatuses([]);
      }
    }
  }, [selectedMultiFilter, statusTprmId]);

  const visibleStatuses = useMemo(() => {
    return filteredStatuses.length > 0 ? filteredStatuses : kanbanStatuses;
  }, [filteredStatuses, kanbanStatuses]);

  return { isActiveKanban, kanbanStatuses: visibleStatuses, statusTprmId };
};
