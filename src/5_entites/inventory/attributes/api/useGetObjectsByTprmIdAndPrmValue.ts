import { objectsApi } from '6_shared';
import { useEffect } from 'react';

interface IProps {
  tprm_id: number | null;
  value: string;
  newOffset: number;
  skip?: boolean;
}

export const useGetObjectsByTprmIdAndPrmValue = ({ tprm_id, value, newOffset, skip }: IProps) => {
  const { data: cachedData } = objectsApi.endpoints.getObjectsByTprmIdAndPrmValue.useQueryState({
    tprm_id,
    value,
    offset: newOffset,
  });

  const [getObjectsByTprmIdAndPrmValue] = objectsApi.useLazyGetObjectsByTprmIdAndPrmValueQuery();

  useEffect(() => {
    if (skip || newOffset === 0) return;
    getObjectsByTprmIdAndPrmValue({ tprm_id, value, offset: newOffset });
  }, [newOffset, skip]);

  const { data: objectsByTprmIdAndPrmValueData, isFetching: isObjectsByTprmIdAndPrmValueFetching } =
    objectsApi.useGetObjectsByTprmIdAndPrmValueQuery(
      { tprm_id, value, offset: newOffset },
      { skip: skip || !!cachedData },
    );

  return {
    objectsByTprmIdAndPrmValueData: cachedData ?? objectsByTprmIdAndPrmValueData,
    isObjectsByTprmIdAndPrmValueFetching,
  };
};
