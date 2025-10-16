import { searchApiV2 } from '6_shared';

const { useGetObjectsByNameWithMisspelledWordsOrTypoMistakesQuery } = searchApiV2;

interface IProps {
  searchValue: string;
  tmo_id: number;
  offset?: number;
  limit?: number;
  skip?: boolean;
}

export const useSearchObjectsByNameWithMisspelledWords = ({
  searchValue,
  tmo_id,
  offset = 0,
  limit = 50,
  skip,
}: IProps) => {
  const {
    data: objectsByNameWithMisspelledWordsData,
    isFetching: isObjectsByNameWithMisspelledWordsFetching,
    isError: isObjectsByNameWithMisspelledWordsError,
  } = useGetObjectsByNameWithMisspelledWordsOrTypoMistakesQuery(
    {
      search_value: searchValue,
      tmo_id,
      limit,
      offset,
    },
    {
      skip: skip || searchValue.length < 2,
    },
  );

  return {
    objectsByNameWithMisspelledWordsData,
    isObjectsByNameWithMisspelledWordsFetching,
    isObjectsByNameWithMisspelledWordsError,
  };
};
