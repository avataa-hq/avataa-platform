import { searchApiV2 } from '6_shared';

interface IProps {
  searchValue: string;
  newOffset: number;
  tmoIds?: number[];
  skip?: boolean;
}

export const useGetObjectsBySearchValue = ({ searchValue, newOffset, tmoIds, skip }: IProps) => {
  const { useGetInventoryObjectsByValueQuery } = searchApiV2;
  const { data: inventoryObjectsSearchData, isFetching: isInventoryObjectsDataFetching } =
    useGetInventoryObjectsByValueQuery(
      {
        search_value: searchValue,
        limit: 50,
        offset: newOffset,
        include_tmo_name: true,
        tmo_ids: tmoIds,
      },
      { skip },
    );

  return { inventoryObjectsSearchData, isInventoryObjectsDataFetching };
};
