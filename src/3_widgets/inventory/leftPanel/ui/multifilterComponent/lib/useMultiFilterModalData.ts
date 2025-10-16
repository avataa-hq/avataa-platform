import { useMemo, useState } from 'react';
import {
  ITmoInfo,
  camundaColumns,
  INestedFilterColumn,
  objectTypesApi,
  parameterTypesApi,
} from '6_shared';
import { transformColumnType } from '5_entites';

const camundaColumnList: INestedFilterColumn[] = camundaColumns.map((cc) => ({
  id: cc.id,
  name: cc.name,
  type: transformColumnType(cc.val_type),
}));

// const ALARM_FM_TM0: ITmoInfo = {
//   id: 41557,
//   name: 'AlarmFM',
// };

export const useMultiFilterModalData = (skipResponse?: boolean) => {
  const { useGetObjectTypesQuery } = objectTypesApi;
  const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;
  const [selectedTmo, setSelectedTmo] = useState<ITmoInfo | null>(null);

  const {
    data: inventoryObjectTypeListData,
    isFetching: isFetchingObjectTypes,
    isError: isErrorObjectTypes,
  } = useGetObjectTypesQuery({}, { skip: skipResponse });

  const {
    data: inventoryParamTypesData,
    isFetching: isFetchingParamTypes,
    isError: isErrorParamTypes,
  } = useGetObjectTypeParamTypesQuery(
    { id: selectedTmo?.id! },
    { skip: skipResponse || !selectedTmo || !selectedTmo?.id },
  );

  const objectTypeList = useMemo<ITmoInfo[]>(() => {
    if (!inventoryObjectTypeListData) return [];
    return inventoryObjectTypeListData.flatMap((iot) => {
      if (!iot.lifecycle_process_definition) return [];
      return { id: iot.id, name: iot.name };
    });
  }, [inventoryObjectTypeListData]);

  const columnsList = useMemo<INestedFilterColumn[]>(() => {
    if (!inventoryParamTypesData) return [];

    const convertConstraint = (constraint: string | null | undefined) => {
      if (constraint == null) return null;
      const replaced = constraint.replace(/'/g, '"');
      try {
        const parsed = JSON.parse(replaced);
        if (Array.isArray(parsed)) return parsed as string[];
      } catch (error) {
        return null;
      }
      return null;
    };

    const columnsFromInventory = inventoryParamTypesData.map(
      ({ id, name, val_type, constraint }) => {
        const correctConstraint = convertConstraint(constraint);
        return {
          id: String(id),
          name,
          type: transformColumnType(val_type) as any,
          ...(correctConstraint && { selectOptions: correctConstraint }),
        };
      },
    );
    return [...columnsFromInventory, ...camundaColumnList];
  }, [inventoryParamTypesData]);

  return {
    selectedTmo,
    setSelectedTmo,
    objectTypeList,
    isErrorObjectTypes,
    isFetchingObjectTypes,
    columnsList,
    isFetchingParamTypes,
    isErrorParamTypes,
  };
};
