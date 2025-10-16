import { useMemo } from 'react';
import { useGetIncomingMoLinks, useGetOutgoingMoLinks } from '../../../api';

interface IProps {
  moId: number;
}

export const useGetLinkedObjectsData = ({ moId }: IProps) => {
  const { incomingMoLinksData, incomingMoLinksRefetch } = useGetIncomingMoLinks({
    moId,
    limit: 1000,
    offset: 0,
  });

  const incMoLinkInfo = useMemo(() => incomingMoLinksData?.mo_link_info, [incomingMoLinksData]);

  const { outMoLinksData, outMoLinksRefetch } = useGetOutgoingMoLinks({ objIds: [moId] });

  const outMoLinkInfo = useMemo(
    () =>
      outMoLinksData?.out_mo_link_info[0] ? outMoLinksData?.out_mo_link_info[0]?.mo_out_data : [],
    [outMoLinksData],
  );

  return { incMoLinkInfo, outMoLinkInfo, incomingMoLinksRefetch, outMoLinksRefetch };
};
