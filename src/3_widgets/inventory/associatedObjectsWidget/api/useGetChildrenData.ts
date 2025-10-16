import { useMemo } from 'react';
import { objectTypesApi, searchApiV2 } from '6_shared';
import { ITmoModel } from '4_features';

interface IProps {
  tmoId: number | null;
  inventoryObjectId?: number | null;
  skipFetching?: boolean;
}
export const useGetChildrenData = ({ tmoId, inventoryObjectId, skipFetching }: IProps) => {
  const { useGetObjectTypesChildQuery } = objectTypesApi;
  const { useGetChildrenGroupedByTmoQuery } = searchApiV2;

  const { data: childTmosData, isFetching: isChildTmosDataLoading } = useGetObjectTypesChildQuery(
    tmoId!,
    {
      skip: !tmoId || skipFetching,
    },
  );
  const { data: childrenGroupedByTmo, isFetching: isChildrenGroupedByTmoLoading } =
    useGetChildrenGroupedByTmoQuery(inventoryObjectId!, {
      skip: !inventoryObjectId || skipFetching,
    });

  const childrenTmoModel = useMemo<ITmoModel[]>(() => {
    if (!childTmosData || !childrenGroupedByTmo) return [];

    const notEmptyTmo = Object.keys(childrenGroupedByTmo);

    return childTmosData.flatMap((child) => {
      if (notEmptyTmo.includes(String(child.id))) {
        return { tmoName: child.name, tmoId: child.id };
      }
      return [];
    });
  }, [childTmosData, childrenGroupedByTmo]);

  return {
    childrenTmoModel,
    isLoadingChildrenData: isChildTmosDataLoading || isChildrenGroupedByTmoLoading,
  };
};
