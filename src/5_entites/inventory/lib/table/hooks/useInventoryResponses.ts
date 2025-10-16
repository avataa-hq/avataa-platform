import {
  parameterTypesApi,
  objectTypesApi,
  IGetObjectsByFiltersBody,
  searchApiV2,
  InventoryParameterTypesModel,
} from '6_shared';
import { useEffect, useState } from 'react';

const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;
const { useGetObjectTypeByIdQuery } = objectTypesApi;
const { useGetObjectsByFiltersQuery, useGetObjectsByIdsQuery } = searchApiV2;

interface IProps {
  objectsByFiltersBody: IGetObjectsByFiltersBody;
  skip?: boolean;
}

export const useInventoryResponses = ({ objectsByFiltersBody, skip }: IProps) => {
  const { tmo_id: tmoId } = objectsByFiltersBody;

  const [parentObjectIds, setParentObjectIds] = useState<number[]>([]);
  const [parentColumns, setParentColumns] = useState<InventoryParameterTypesModel[]>([]);

  const {
    data: inventoryColumns,
    isLoading: isInventoryColumnsFirstLoading,
    isFetching: isInventoryColumnsLoading,
    isSuccess: isInventoryColumnsSuccess,
    isError: isInventoryColumnsError,
  } = useGetObjectTypeParamTypesQuery({ id: tmoId }, { skip: !tmoId || skip });

  const {
    data: inventoryRows,
    isSuccess: isInventoryRowsSuccess,
    isFetching: inventoryRowsLoading,
    isError: rowsLoadingError,
    refetch: refetchInventoryRows,
  } = useGetObjectsByFiltersQuery(objectsByFiltersBody, {
    skip: !tmoId || !objectsByFiltersBody || skip,
  });

  const {
    data: currentTmoData,
    isSuccess: isCurrentTmoSuccess,
    isFetching: currentTmoLoading,
    isError: currentTmoError,
  } = useGetObjectTypeByIdQuery(tmoId, { skip: !tmoId });

  const {
    data: inventoryParentColumns,
    isLoading: isInventoryParentColumnsFirstLoading,
    isFetching: isInventoryParentColumnsLoading,
    isSuccess: isInventoryParentColumnsSuccess,
    isError: isInventoryParentColumnsError,
  } = useGetObjectTypeParamTypesQuery(
    { id: currentTmoData?.p_id as number },
    { skip: !currentTmoData?.p_id },
  );

  useEffect(() => {
    if (currentTmoData?.p_id && inventoryParentColumns) {
      setParentColumns(inventoryParentColumns);
    } else {
      setParentColumns([]);
    }
  }, [currentTmoData?.p_id, inventoryParentColumns]);

  useEffect(() => {
    if (inventoryRows && inventoryRows.objects.length) {
      const parentIds = inventoryRows.objects.flatMap((obj) => {
        if (!obj.p_id) return [];
        return [obj.p_id];
      });

      const parentIdsUnique = [
        ...new Set(parentIds.filter((value) => value !== null && value !== 0)),
      ];

      setParentObjectIds(parentIdsUnique);
    }
  }, [inventoryRows]);

  const {
    data: inventoryParentRows,
    isSuccess: isInventoryParentRowsSuccess,
    isFetching: inventoryParentRowsLoading,
    isError: inventoryParentRowsError,
  } = useGetObjectsByIdsQuery(parentObjectIds, {
    skip: !isInventoryParentColumnsSuccess || !parentObjectIds || !parentObjectIds.length,
  });

  return {
    columnsData: {
      inventoryColumns,
      isInventoryColumnsFirstLoading,
      isInventoryColumnsLoading,
      isInventoryColumnsSuccess,
      isInventoryColumnsError,
    },
    rowsData: {
      inventoryRows,
      isInventoryRowsSuccess,
      inventoryRowsLoading,
      rowsLoadingError,
      refetchInventoryRows,
    },
    currentObjType: {
      currentTmoData,
      isCurrentTmoSuccess,
      currentTmoLoading,
      currentTmoError,
    },
    parentColumnsData: {
      inventoryParentColumns: parentColumns,
      isInventoryParentColumnsFirstLoading,
      isInventoryParentColumnsLoading,
      isInventoryParentColumnsSuccess,
      isInventoryParentColumnsError,
    },
    parentRowsData: {
      inventoryParentRows,
      isInventoryParentRowsSuccess,
      inventoryParentRowsLoading,
      inventoryParentRowsError,
    },
  };
};
