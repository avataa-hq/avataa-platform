import { useMemo } from 'react';
import { Autocomplete, TextField, Tooltip } from '@mui/material';
import { getItemName } from '2_pages/adminUserManagement/utilities/utilities';
import { IGroup, ItemType } from '6_shared';

interface IProps {
  listElements: ItemType[];
  setRelatedItemObjects: React.Dispatch<React.SetStateAction<ItemType[]>>;
}

const formatPathForTooltip = (path: string) => {
  const parts = path.split('/');
  return parts.join(' → ');
};

const flattenGroups = (groups: IGroup[]): IGroup[] => {
  const flatArray: IGroup[] = [];

  function flatten(group: IGroup): void {
    flatArray.push({
      id: group.id,
      name: group.name,
      path: group.path,
    });

    if (group.subGroups && group.subGroups.length > 0) {
      group.subGroups.forEach((subGroup: IGroup) => flatten(subGroup));
    }
  }

  groups.forEach((group) => flatten(group));

  return flatArray;
};

export const Multiselect = ({ listElements, setRelatedItemObjects }: IProps) => {
  const onChange = (newValue: any | null) => {
    setRelatedItemObjects(newValue);
  };

  const items = useMemo(() => {
    return Array.isArray(listElements) && listElements.every((item) => 'subGroups' in item)
      ? flattenGroups(listElements)
      : listElements;
  }, [listElements]);

  return (
    <div>
      <Autocomplete
        multiple
        id="tags-outlined"
        disableCloseOnSelect
        options={items}
        renderOption={(props, option) =>
          'path' in option ? (
            <Tooltip title={formatPathForTooltip(option.path ?? '')}>
              <span {...props}>{getItemName(option)}</span>
            </Tooltip>
          ) : (
            <span {...props}>{getItemName(option)}</span>
          )
        }
        getOptionLabel={(option: ItemType) => getItemName(option)!}
        onChange={(_, newValue) => onChange(newValue)}
        filterSelectedOptions
        renderInput={(params) => <TextField {...params} />}
      />
    </div>
  );
};
