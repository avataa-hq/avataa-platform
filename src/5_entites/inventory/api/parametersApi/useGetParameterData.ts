import { parametersApi } from '6_shared';

interface IProps {
  paramIds: number[];
  skip?: boolean;
}

export const useGetParameterData = ({ paramIds, skip }: IProps) => {
  const { useGetParameterDataQuery } = parametersApi;

  const {
    data: parametersData,
    isFetching: isParametersDataFetching,
    isError: isParametersDataError,
  } = useGetParameterDataQuery(paramIds, {
    skip,
  });

  return { parametersData, isParametersDataFetching, isParametersDataError };
};
