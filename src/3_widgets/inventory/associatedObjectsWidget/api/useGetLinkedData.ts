import { useMemo } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid-premium';
import { DEFAULT_PAGINATION_MODEL, NavigationData, searchApiV2 } from '6_shared';

interface IProps {
  tmoId: number | null;
  pagination: Record<string, GridPaginationModel>;
  selectedObjectData?: NavigationData | null;
  skipFetching?: boolean;
}
export const useGetLinkedData = ({
  selectedObjectData,
  pagination,
  skipFetching,
  tmoId,
}: IProps) => {
  const { useGetMoLinkInfoQuery } = searchApiV2;

  const currentPagination = tmoId
    ? pagination[tmoId] ?? DEFAULT_PAGINATION_MODEL
    : DEFAULT_PAGINATION_MODEL;

  const { data: moLinksData, isLoading: moLinksDataLoading } = useGetMoLinkInfoQuery(
    {
      id: selectedObjectData?.id!,
      limit: currentPagination.pageSize,
      offset: currentPagination.page,
    },
    { skip: !selectedObjectData?.id || skipFetching },
  );

  const commonViewRows = useMemo(() => {
    if (!moLinksData) return [];

    const { mo_link_info: moLinkInfo } = moLinksData;

    return moLinkInfo.map((moLink) => {
      const { tmo_name, tprm_name, mo_name, parent_mo_name, mo_id, parent_mo_id } = moLink;

      return {
        id: mo_id,
        tmo_name,
        tprm_name,
        mo_name,
        parent_mo_name,
        parent_mo_id,
      };
    });
  }, [moLinksData]);

  const linkedTmoModel = useMemo(() => {
    if (!moLinksData) return [];

    const { mo_link_info: moLinkInfo, additional_info: linkInfoTmosModel } = moLinksData;

    return linkInfoTmosModel.map((item) => ({
      tmoName: item.tmo_name,
      tmoId: item.tmo_id,
      tprmId: String(item.tprm_id),
      moIds: moLinkInfo.flatMap((itm) => {
        if (itm.tmo_id !== item.tmo_id) return [];
        return itm.mo_id;
      }),
    }));
  }, [moLinksData]);

  return {
    linkedTmoModel,
    isLoadingLinkedData: moLinksDataLoading,
    commonViewRows,
    linkTotalCount: moLinksData?.total ?? 0,
  };
};
