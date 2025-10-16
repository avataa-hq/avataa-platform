import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import {
  IInventorySearchObjectModel,
  useAppNavigate,
  useDebounceValue,
  useObjectDetails,
  useTranslate,
} from '6_shared';

import {
  GlobalSearchStyled,
  InputContainer,
  MiniSphere1,
  MiniSphere2,
  Sphere,
} from './GlobalSearch.styled';
import { SearchList } from './searchList/SearchList';
import { useGetSearchData } from '../api/useGetSearchData';
import { MainModuleListE } from '../../../config/mainModulesConfig/mainModuleList';

export const GlobalSearch = () => {
  const translate = useTranslate();
  const gsRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useAppNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [selectedListItem, setSelectedListItem] = useState<IInventorySearchObjectModel | null>(
    null,
  );

  const debounceText = useDebounceValue(textValue);

  const { pushObjectIdToStack } = useObjectDetails();

  const { objectsList, isFetchingObjectsList } = useGetSearchData({
    searchValue: debounceText,
  });

  const onSearchClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);

    if (!isExpanded) {
      inputRef.current?.focus();
    }
  };

  const onListItemClick = useCallback(
    (e: MouseEvent<HTMLDivElement>, item: IInventorySearchObjectModel) => {
      setSelectedListItem(item);
      navigate(MainModuleListE.objectDetails);
      pushObjectIdToStack(item.id);
    },
    [navigate],
  );

  const documentClickFn = useCallback(
    ({ target }: Event) => {
      // @ts-ignore
      const isClickOnBackDrop = target?.classList?.contains('MuiBackdrop-root');

      if (gsRef.current && !gsRef.current.contains(target as Node) && !isClickOnBackDrop) {
        if (isExpanded) setIsExpanded(false);
      }
    },
    [isExpanded],
  );

  useEffect(() => {
    document.addEventListener('click', documentClickFn);

    return () => {
      document.removeEventListener('click', documentClickFn);
    };
  }, [documentClickFn]);
  return (
    <GlobalSearchStyled ref={gsRef} state={isExpanded ? 'expanded' : 'collapsed'}>
      {isExpanded ? (
        <InputContainer
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <TextField
            type="search"
            placeholder={translate('Search')}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            inputRef={inputRef}
            fullWidth
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isExpanded && !textValue && <SearchIcon />}
                </InputAdornment>
              ),
            }}
          />
          {isExpanded && debounceText.length ? (
            <SearchList
              isExpanded={isExpanded}
              isLoading={isFetchingObjectsList}
              objectsList={objectsList}
              selectedListItem={selectedListItem}
              onListItemClick={onListItemClick}
              searchValue={debounceText}
            />
          ) : null}
        </InputContainer>
      ) : (
        <>
          <Sphere onClick={onSearchClick} />
          <MiniSphere1 />
          <MiniSphere2 />
        </>
      )}
    </GlobalSearchStyled>
  );
};
