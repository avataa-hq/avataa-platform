import { searchApiV2 } from '6_shared';

const { useGetIncMoLinksQuery } = searchApiV2;

interface IProps {
  objIds: number[];
  skip?: boolean;
}

export const useGetIncomingMoLinksForObjectsList = ({ objIds, skip }: IProps) => {
  const {
    data: incMoLinksData,
    isFetching: incMoLinksFetching,
    isError: incMoLinksError,
    isSuccess: incMoLinksSuccess,
    refetch: incMoLinksRefetch,
  } = useGetIncMoLinksQuery(objIds, {
    skip: !objIds || !objIds.length || !objIds[0] || skip,
  });

  return {
    incMoLinksData,
    incMoLinksFetching,
    incMoLinksError,
    incMoLinksSuccess,
    incMoLinksRefetch,
  };
};
