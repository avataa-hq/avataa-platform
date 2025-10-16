import { searchApiV2 } from '6_shared';

const { useGetMoLinkInfoQuery } = searchApiV2;

interface IProps {
  moId: number;
  limit?: number;
  offset?: number;
  skip?: boolean;
}

export const useGetIncomingMoLinks = ({ moId, limit, offset, skip }: IProps) => {
  const {
    data: incomingMoLinksData,
    isFetching: incomingMoLinksFetching,
    isError: incomingMoLinksError,
    isSuccess: incomingMoLinksSuccess,
    refetch: incomingMoLinksRefetch,
  } = useGetMoLinkInfoQuery({ id: moId, limit, offset }, { skip: !moId || skip });

  return {
    incomingMoLinksData,
    incomingMoLinksFetching,
    incomingMoLinksError,
    incomingMoLinksSuccess,
    incomingMoLinksRefetch,
  };
};
