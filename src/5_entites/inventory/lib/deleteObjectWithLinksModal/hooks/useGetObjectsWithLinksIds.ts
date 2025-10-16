import { useMemo } from 'react';
import { useGetIncomingMoLinksForObjectsList, useGetOutgoingMoLinks } from '../../../api';

interface IProps {
  objIds: number[];
}

export const useGetObjectsWithLinksIds = ({ objIds }: IProps) => {
  const { outMoLinksData } = useGetOutgoingMoLinks({ objIds });
  const { incMoLinksData } = useGetIncomingMoLinksForObjectsList({ objIds });

  // OUTGOING
  const objectsWithOutMoLinksIds = useMemo(() => {
    if (!outMoLinksData?.out_mo_link_info) return [];

    return outMoLinksData.out_mo_link_info.flatMap((item) => {
      if (!item.mo_out_data.length) return [];

      return item.mo_id;
    });
  }, [outMoLinksData]);

  // INCOMING
  const objectsWithIncMoLinksIds = useMemo(() => {
    if (!incMoLinksData?.list_info) return [];

    return incMoLinksData.list_info.flatMap((item) => {
      if (!item.mo_link_info_response.mo_link_info.length) return [];

      return item.mo_id;
    });
  }, [incMoLinksData]);

  const objectsWithLinksIds = useMemo(() => {
    return objIds.flatMap((item) => {
      if (!objectsWithOutMoLinksIds.includes(item) && !objectsWithIncMoLinksIds.includes(item))
        return [];

      return item;
    });
  }, [objIds, objectsWithIncMoLinksIds, objectsWithOutMoLinksIds]);

  const objectsWithoutLinksIds = useMemo(() => {
    return objIds.flatMap((item) => {
      if (objectsWithLinksIds.includes(item)) return [];

      return item;
    });
  }, [objIds, objectsWithLinksIds]);

  return { objectsWithLinksIds, objectsWithoutLinksIds };
};
