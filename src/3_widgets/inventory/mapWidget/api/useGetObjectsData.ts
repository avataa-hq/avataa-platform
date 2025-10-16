import { useCallback, useEffect, useState } from 'react';
import {
  IInventoryBoundsModel,
  searchApiV2,
  IInventorySearchObjectModel,
  IGetObjectsByCoordsBody,
  useDebounceValue,
} from '6_shared';

const normalizeBounds = (bounds: IInventoryBoundsModel) => {
  const normalizeValue = (value: number) => {
    if (value < 0 && value < -90) return -90;
    if (value > 0 && value > 90) return 90;
    return value;
  };
  return Object.entries(bounds).reduce((acc, [key, value]) => {
    acc[key as keyof IInventoryBoundsModel] = normalizeValue(value);

    return acc;
  }, {} as IInventoryBoundsModel);
};

const TIMEOUT = 200;

interface IProps {
  setObjectsByObjectTypeData: (data: IInventorySearchObjectModel[]) => void;
  outerMapBounds?: IInventoryBoundsModel | null;
  tmoIds: number[];
  additionalSkip?: boolean;
}

export const useGetObjectsData = ({
  setObjectsByObjectTypeData,
  outerMapBounds,
  tmoIds,
  additionalSkip,
}: IProps) => {
  const { useGetObjectsByCoordsQuery } = searchApiV2;

  const throttledOuterMapBounds = useDebounceValue(outerMapBounds, TIMEOUT);
  const throttledTmoIds = useDebounceValue(tmoIds, TIMEOUT);
  const [body, setBody] = useState<IGetObjectsByCoordsBody | null>(null);

  const skip = !body || tmoIds.length === 0 || additionalSkip;

  const { data, isFetching, refetch } = useGetObjectsByCoordsQuery(body!, { skip });

  useEffect(() => {
    if (!throttledTmoIds?.length || !throttledOuterMapBounds) return;

    setBody({
      ...normalizeBounds(throttledOuterMapBounds!),
      tmo_ids: throttledTmoIds,
      with_parameters: true,
    });
  }, [throttledOuterMapBounds, throttledTmoIds]);

  useEffect(() => {
    const actualData = data?.objects?.filter((item) => throttledTmoIds.includes(item.tmo_id));

    setObjectsByObjectTypeData(actualData ?? []);
  }, [data, setObjectsByObjectTypeData, throttledTmoIds]);

  const refetchObjectByCoords = useCallback(() => {
    if (data) refetch();
  }, [refetch, data]);

  return { isLoading: isFetching, refetchObjectByCoords };
};
