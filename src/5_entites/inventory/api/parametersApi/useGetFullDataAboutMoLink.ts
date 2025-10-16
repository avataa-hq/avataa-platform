import { parametersApi } from '6_shared';

interface IProps {
  parameterIds: number[];
  skip?: boolean;
}

export const useGetFullDataAboutMoLink = ({ parameterIds, skip }: IProps) => {
  const { useGetFullDataAboutMoLinkQuery } = parametersApi;

  const { data: cachedData } =
    parametersApi.endpoints.getFullDataAboutMoLink.useQueryState(parameterIds);

  const {
    data: fullDataAboutMoLink,
    isFetching: isFullDataAboutMoLinkFetching,
    isError: isFullDataAboutMoLinkError,
  } = useGetFullDataAboutMoLinkQuery(parameterIds, { skip: skip || !!cachedData });

  return {
    fullDataAboutMoLink: cachedData || fullDataAboutMoLink,
    isFullDataAboutMoLinkFetching,
    isFullDataAboutMoLinkError,
  };
};
