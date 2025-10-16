import { parametersApi } from '6_shared';

interface IProps {
  parameterIds: number[];
  skip?: boolean;
}

export const useGetFullDataAboutPrmLink = ({ parameterIds, skip }: IProps) => {
  const { useGetFullDataAboutPrmLinkQuery } = parametersApi;

  const { data: cachedData } =
    parametersApi.endpoints.getFullDataAboutPrmLink.useQueryState(parameterIds);

  const {
    data: fullDataAboutPrmLink,
    isFetching: isFullDataAboutPrmLinkFetching,
    isError: isFullDataAboutPrmLinkError,
  } = useGetFullDataAboutPrmLinkQuery(parameterIds, { skip: skip || !!cachedData });

  return {
    fullDataAboutPrmLink: cachedData || fullDataAboutPrmLink,
    isFullDataAboutPrmLinkFetching,
    isFullDataAboutPrmLinkError,
  };
};
