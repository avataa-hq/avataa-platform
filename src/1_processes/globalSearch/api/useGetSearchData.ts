import { IInventorySearchObjectModel, searchApiV2 } from '6_shared';
import { useEffect, useState } from 'react';

const { useGetInventoryObjectsByValueQuery } = searchApiV2;

interface IProps {
  searchValue: string;
}

export const useGetSearchData = ({ searchValue }: IProps) => {
  const [objectsList, setObjectsList] = useState<IInventorySearchObjectModel[]>([]);

  const { data: searchResult, isFetching: isFetchingObjectsList } =
    useGetInventoryObjectsByValueQuery(
      {
        search_value: searchValue,
        include_tmo_name: true,
        limit: 10,
      },
      { skip: !searchValue },
    );

  useEffect(() => {
    if (!searchResult) return;
    setObjectsList(searchResult.objects);
  }, [searchResult]);

  useEffect(() => {
    if (searchValue === '') setObjectsList([]);
  }, [searchValue]);

  return { objectsList, isFetchingObjectsList };
};
