import { createOptionsIDList } from '5_entites';
import { IParentIDOption, searchApiV2, useAbortControllerSignalByArgsChange } from '6_shared';
import { useEffect, useState } from 'react';

interface IProps {
  searchValue: string;
  objectTypeIds?: number[];
  skip?: boolean;
}

export const useSearchPointIdByName = ({ searchValue, objectTypeIds, skip }: IProps) => {
  const [parentABIDOptions, setParentABIDOptions] = useState<IParentIDOption[]>([]);

  const { signal } = useAbortControllerSignalByArgsChange({ deps: [searchValue] });

  const { data: objectsDataByName, isFetching: isFetchingObjectsDataByName } =
    searchApiV2.useGetInventoryObjectsByValueQuery(
      {
        search_value: searchValue.trim(),
        limit: 50,
        tmo_ids: objectTypeIds,
        signal,
      },
      { skip },
    );

  useEffect(() => {
    if (objectsDataByName) {
      const parentIDOptionsList = createOptionsIDList(objectsDataByName.objects);
      setParentABIDOptions(parentIDOptionsList);
    }
  }, [objectsDataByName]);

  return {
    parentABIDOptions,
    isFetchingObjectsDataByName,
  };
};
