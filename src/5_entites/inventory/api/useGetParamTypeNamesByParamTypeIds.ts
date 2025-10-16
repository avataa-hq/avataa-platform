import { severityApi } from '6_shared';

const { useConvertTprmIdToColumnNamesQuery } = severityApi;

interface IProps {
  tprmIds: number[];
  skip?: boolean;
}

export const useGetParamTypeNamesByParamTypeIds = ({ tprmIds, skip }: IProps) => {
  const { data: paramTypeNamesData, isFetching: isParamTypeNamesFetching } =
    useConvertTprmIdToColumnNamesQuery(tprmIds, {
      skip: skip || tprmIds.length === 0,
    });

  return { paramTypeNamesData, isParamTypeNamesFetching };
};
