import { useState } from 'react';
import {
  InventoryObjectTypesModel,
  useTranslate,
  ActionTypes,
  useTabs,
  useLeftPanelWidget,
} from '6_shared';
import { CustomSearch } from 'components/_reused components/myInput/CustomSearch';

interface IProps {
  value: string;
  onChange: (value: string) => void;
  objectTypes?: InventoryObjectTypesModel[] | undefined;
  isFetchingObjectTypes?: boolean;
  objectTypesAnchor?: string;
  permissions?: Record<ActionTypes, boolean>;
}
export const FilterInput = ({
  onChange,
  value,
  objectTypes,
  isFetchingObjectTypes,
  objectTypesAnchor,
  permissions,
}: IProps) => {
  const translate = useTranslate();
  const { selectedTab: activePage } = useTabs();
  const { selectedTabs } = useLeftPanelWidget();
  const [searchValue, setSearchValue] = useState('');

  return (
    <CustomSearch
      IconPosition="right"
      disabled={!(permissions?.view ?? true)}
      placeHolderText={translate('Search')}
      value={selectedTabs[activePage] === 'objectTypes' ? searchValue : value}
      onChange={
        selectedTabs[activePage] === 'objectTypes'
          ? (event) => setSearchValue(event.target.value)
          : (event) => onChange(event.target.value)
      }
      setSearchValue={setSearchValue}
      searchedValue={searchValue}
      objectTypes={objectTypes}
      isFetchingObjectTypes={isFetchingObjectTypes}
      anchor={objectTypesAnchor}
    />
  );
};
