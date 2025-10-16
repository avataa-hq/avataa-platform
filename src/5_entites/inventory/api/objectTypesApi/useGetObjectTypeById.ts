import { objectTypesApi } from '6_shared';

const { useGetObjectTypeByIdQuery, useLazyGetObjectTypeByIdQuery } = objectTypesApi;

interface IProps {
  tmoId?: number;
  skip?: boolean;
}

export const useGetObjectTypeById = ({ tmoId = 0, skip = false }: IProps) => {
  const [getObjectTypeById] = useLazyGetObjectTypeByIdQuery();

  const {
    data: inventoryObjectTypeData,
    isFetching: isFetchingInventoryObjectTypeData,
    isError: isErrorInventoryObjectTypeData,
    refetch: inventoryObjectTypeDataRefetchFn,
  } = useGetObjectTypeByIdQuery(tmoId, { skip: skip || tmoId === 0 });

  return { getObjectTypeById, inventoryObjectTypeData, isFetchingInventoryObjectTypeData };
};
