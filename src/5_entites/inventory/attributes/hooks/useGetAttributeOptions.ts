import { useEffect, useState } from 'react';
import { type ParentIDOption } from '5_entites';
import { formatObjectName } from '5_entites/inventory/lib';
import { searchApiV2, useAbortControllerSignalByArgsChange } from '6_shared';

interface IProps {
  searchValue: string;
  objectTypeIds: number[];
  skip?: boolean;
}

export const useGetAttributeOptions = ({ searchValue, objectTypeIds, skip }: IProps) => {
  const [parentABIDOptions, setParentABIDOptions] = useState<ParentIDOption[]>([]);

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
      const parentIDOptionsList = objectsDataByName.objects.map((item) => ({
        id: item.id,
        name: formatObjectName(item.name),
      }));
      setParentABIDOptions(parentIDOptionsList);
    }
  }, [objectsDataByName]);

  return { parentABIDOptions, isFetchingObjectsDataByName };
};
