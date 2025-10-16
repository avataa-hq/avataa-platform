import { IGetObjectsByFiltersBody, searchApiV2 } from '6_shared';
import { GridLogicOperator } from '@mui/x-data-grid';
import { useMemo } from 'react';

const { useGetObjectsByFiltersQuery } = searchApiV2;

interface IProps {
  objectId: number | null;
  tmoId: number | null;
  skip?: boolean;
}

export const useGetObjectByFiltersById = ({ objectId, tmoId, skip }: IProps) => {
  const body: IGetObjectsByFiltersBody = useMemo(
    () => ({
      filter_columns: [
        {
          columnName: 'id',
          rule: 'and' as GridLogicOperator,
          filters: [
            {
              operator: 'isAnyOf',
              value: [objectId],
            },
          ],
        },
      ],
      limit: 50,
      offset: 0,
      tmo_id: tmoId ?? 0,
    }),
    [objectId, tmoId],
  );

  const { data: objectByFilters, isFetching: isObjectByFiltersLoading } =
    useGetObjectsByFiltersQuery(body, {
      skip: skip || !objectId || !tmoId,
      refetchOnMountOrArgChange: true,
    });

  return {
    objectByFilters: objectByFilters?.objects?.[0],
    isObjectByFiltersLoading,
  };
};
