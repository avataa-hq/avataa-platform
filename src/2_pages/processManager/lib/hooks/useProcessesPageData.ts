import { useEffect, useState } from 'react';
import { useGetReturnableParamTypes } from '5_entites';
import {
  convertTypeForParamType,
  IFilterSetModel,
  InventoryObjectTypesModel,
  objectTypesApi,
  parameterTypesApi,
  useLeftPanelWidget,
  useProcessManager,
  useSeverity,
} from '6_shared';
import useGetPMTmo from './useGetPMTmo';
import { HierarchyObject } from '../../../../6_shared/api/hierarchy/types';

interface IProps {
  multiFilterTmoIds: string[];
  selectedMultiFilter: IFilterSetModel | null;
  childItems: HierarchyObject[];
}

export const useProcessesPageData = ({
  multiFilterTmoIds,
  selectedMultiFilter,
  childItems,
}: IProps) => {
  const { useGetObjectTypeByIdQuery, useGetObjectTypesQuery } = objectTypesApi;
  const { useGetParamTypeByIdQuery } = parameterTypesApi;

  const [pmCurrentTmo, setPmCurrentTmo] = useState<InventoryObjectTypesModel | null>(null);

  const { setMultiFilterSeverityIds } = useLeftPanelWidget();

  const { setPmTmoId } = useProcessManager();

  const { setSeverityId, setSeverityInfo } = useSeverity();

  // ===== Get current selected TMO from first hierarchy or selected filter
  const currentTmo = useGetPMTmo({
    hierarchyFirstChildren: childItems,
    pmSelectedFilterSet: selectedMultiFilter,
  });
  useEffect(() => {
    if (currentTmo) setPmTmoId(currentTmo);
  }, [currentTmo]);
  // =====

  // ===== Get severity ID from current tmo object
  const { data: currentTmoObject } = useGetObjectTypeByIdQuery(currentTmo!, { skip: !currentTmo });
  useEffect(() => {
    if (!currentTmoObject) return;
    setSeverityId(currentTmoObject.severity_id || null);
    setPmCurrentTmo(currentTmoObject);
  }, [currentTmoObject]);
  // =====

  // ===== Get severity ID for all the tmo objects in the Filters
  const { data: currentTmoObjects } = useGetObjectTypesQuery(
    { object_types_ids: multiFilterTmoIds.map((id) => parseInt(id, 10)) },
    {
      skip: !multiFilterTmoIds,
    },
  );

  useEffect(() => {
    if (!currentTmoObjects) return;
    const uniqueSeverityIds = Array.from(
      new Set(
        currentTmoObjects.flatMap((item) => {
          if (item.severity_id == null) return [];
          return String(item.severity_id);
        }),
      ),
    );
    setMultiFilterSeverityIds(uniqueSeverityIds);
  }, [currentTmoObjects]);
  // =====

  const { data: parameterType } = useGetParamTypeByIdQuery(currentTmoObject?.severity_id!, {
    skip: !currentTmoObject || !currentTmoObject?.severity_id,
  });

  useEffect(() => {
    if (!parameterType) return;

    setSeverityInfo({
      headerName: parameterType.name,
      field: parameterType.id.toString(),
      type: convertTypeForParamType(parameterType.val_type),
    });
  }, [parameterType]);

  // ===== get returnable param type

  const { returnableParamTypes, isParamTypesFetching } = useGetReturnableParamTypes({
    pmTmoId: currentTmo,
  });
  // =====

  return {
    returnableParamTypes,
    isParamTypesFetching,
    pmCurrentTmo,
  };
};
