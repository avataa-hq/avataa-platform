import { parameterTypesApi } from '6_shared';

const { useGetParamTypeByIdQuery } = parameterTypesApi;

interface IProps {
  tprmId?: number | null;
  skip?: boolean;
}

export const useGetParamTypeById = ({ tprmId, skip }: IProps) => {
  const { data: paramTypeData, isFetching: isParamTypeFetching } = useGetParamTypeByIdQuery(
    tprmId ?? 0,
    { skip: !tprmId || skip },
  );

  return { paramTypeData, isParamTypeFetching };
};
