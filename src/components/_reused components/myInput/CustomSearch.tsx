import { useEffect, useState } from 'react';
import {
  InventoryObjectTypesModel,
  objectTypesApi,
  useHierarchy,
  useSettingsObject,
} from '6_shared';
import { Search } from '@mui/icons-material';
import { LinearProgress } from '@mui/material';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import { scrollToElementId } from './scrollToElementIdInList';
import {
  CustomSearchStyled,
  SearchListContainer,
  LoadingContainer,
  NoResultItem,
  SearchedResultItemContainer,
  SearchedResultItemName,
} from './CustomSearch.styled';

interface IMyInputProps extends InputBaseProps {
  IconPosition?: 'left' | 'right';
  placeHolderText?: string;
  searchedValue?: string;
  setSearchValue?: React.Dispatch<React.SetStateAction<string>>;
  objectTypes?: InventoryObjectTypesModel[] | undefined;
  isFetchingObjectTypes?: boolean;
  anchor?: string;

  scrollElementId?: string | null;
}

export const CustomSearch = ({
  IconPosition,
  placeHolderText,
  searchedValue,
  setSearchValue,
  objectTypes,
  isFetchingObjectTypes,
  anchor,
  scrollElementId,
  ...props
}: IMyInputProps) => {
  const { useLazySearchObjectTypesQuery } = objectTypesApi;
  const [searchTMOData, { isFetching: isSearchTMOFetching }] = useLazySearchObjectTypesQuery();
  const [searchedTMOData, setSearcheTMOdData] = useState<InventoryObjectTypesModel[] | undefined>(
    undefined,
  );

  const [clickedId, setClickedId] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(false);

  const { setParentId, setSelectedObjectTypeItem } = useHierarchy();

  const { setElementIdToScroll, setObjType } = useSettingsObject();

  useEffect(() => {
    if ((clickedId === null && !scrollElementId) || isFetchingObjectTypes) return;

    setTimeout(() => {
      const id = scrollElementId ? `${scrollElementId}${anchor}` : clickedId;
      scrollToElementId(id!);
      if (scrollElementId) {
        setElementIdToScroll(null);
      }
    }, 1500);
  }, [objectTypes, clickedId, isFetchingObjectTypes, forceUpdate, scrollElementId, anchor]);

  useEffect(() => {
    if (searchedValue === '' && setSearcheTMOdData) {
      setSearcheTMOdData(undefined);
    }
  }, [searchedValue, setSearcheTMOdData]);

  const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchedValue?.length) {
      const data = await searchTMOData(searchedValue).unwrap();
      setSearcheTMOdData(data);
    }
  };

  const onIconClick = async () => {
    if (!searchedValue) return;

    const data = await searchTMOData(searchedValue).unwrap();
    setSearcheTMOdData(data);
  };

  const onSearchItemClick = (item: InventoryObjectTypesModel) => {
    setSelectedObjectTypeItem(item);
    setObjType(item);
    setSearcheTMOdData(undefined);
    setSearchValue?.('');
    setParentId(item.p_id === null ? 0 : item.p_id);

    const elementId = `${item.id}${anchor}`;
    setClickedId(elementId);

    if (elementId === clickedId) {
      setForceUpdate((a) => !a);
    }
  };

  return (
    <>
      <CustomSearchStyled>
        {IconPosition === 'left' && <Search className="icon" onClick={onIconClick} />}
        <InputBase
          placeholder={placeHolderText}
          className="text"
          {...props}
          onKeyPress={handleKeyPress}
        />
        {IconPosition === 'right' && <Search className="icon" onClick={onIconClick} />}
      </CustomSearchStyled>

      {searchedValue?.length && searchedTMOData ? (
        <SearchListContainer>
          {isSearchTMOFetching && (
            <LoadingContainer>
              Loading...
              <LinearProgress sx={{ width: '90%' }} />
            </LoadingContainer>
          )}

          {!isSearchTMOFetching && searchedTMOData?.length === 0 ? (
            <NoResultItem>No result</NoResultItem>
          ) : (
            !isSearchTMOFetching &&
            searchedTMOData?.map((item) => (
              <SearchedResultItemContainer key={item.id} onClick={() => onSearchItemClick(item)}>
                <SearchedResultItemName>{item.name}</SearchedResultItemName>
              </SearchedResultItemContainer>
            ))
          )}
        </SearchListContainer>
      ) : null}
    </>
  );
};
