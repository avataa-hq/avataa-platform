import { searchApiV2 } from '6_shared';

const { useGetOutMoLinksQuery } = searchApiV2;

interface IProps {
  objIds: number[];
  skip?: boolean;
}

export const useGetOutgoingMoLinks = ({ objIds, skip }: IProps) => {
  const {
    data: outMoLinksData,
    isFetching: outMoLinksFetching,
    isError: outMoLinksError,
    isSuccess: outMoLinksSuccess,
    refetch: outMoLinksRefetch,
  } = useGetOutMoLinksQuery(objIds, {
    skip: !objIds || !objIds.length || !objIds[0] || skip,
  });

  return {
    outMoLinksData,
    outMoLinksFetching,
    outMoLinksError,
    outMoLinksSuccess,
    outMoLinksRefetch,
  };
};
