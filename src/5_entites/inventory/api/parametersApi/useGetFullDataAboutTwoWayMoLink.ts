import { parametersApi } from '6_shared';

interface IProps {
  parameterIds: number[];
  skip?: boolean;
}

export const useGetFullDataAboutTwoWayMoLink = ({ parameterIds, skip }: IProps) => {
  const { useGetFullDataAboutTwoWayMoLinkQuery } = parametersApi;

  const {
    data: fullDataAboutTwoWayMoLink,
    isFetching: isFullDataAboutTwoWayMoLinkFetching,
    isError: isFullDataAboutTwoWayMoLinkError,
  } = useGetFullDataAboutTwoWayMoLinkQuery(parameterIds, {
    skip,
  });

  return {
    fullDataAboutTwoWayMoLink,
    isFullDataAboutTwoWayMoLinkFetching,
    isFullDataAboutTwoWayMoLinkError,
  };
};
