import { objectsApi } from '6_shared';

interface IProps {
  objectId?: number | null;
  skip?: boolean;
}

export const useGetInventoryObjectData = ({ objectId, skip }: IProps) => {
  // const { data: cachedData } = objectsApi.endpoints.getObjectWithParameters.useQueryState({
  //   id: objectId ?? null,
  //   with_parameters: true,
  // });

  const {
    data: inventoryObjectData,
    isFetching: isInventoryObjectDataFetching,
    isError: isInventoryObjectDataError,
    error: inventoryObjectDataError,
  } = objectsApi.useGetObjectWithParametersQuery(
    { id: objectId ?? null, with_parameters: true },
    { skip: !objectId || skip },
  );

  // const data = useMemo(() => inventoryObjectData || cachedData, [cachedData, inventoryObjectData]);

  const [getInventoryObjectData] = objectsApi.useLazyGetObjectWithParametersQuery();

  return {
    inventoryObjectData,
    isInventoryObjectDataFetching,
    getInventoryObjectData,
    isInventoryObjectDataError,
    inventoryObjectDataError,
  };
};
