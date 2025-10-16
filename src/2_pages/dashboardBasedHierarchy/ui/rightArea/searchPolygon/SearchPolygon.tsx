import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {
  InventoryAndHierarchyObjectTogether,
  useDashboardBasedHierarchy,
  useDebounceValue,
  useTranslate,
} from '6_shared';
import { SearchPolygonList } from './SearchPolygonList';
import {
  InputContainer,
  SearchButton,
  SearchField,
  SearchPolygonStyled,
} from './SearchPolygon.styled';

interface IProps {
  searchResult: InventoryAndHierarchyObjectTogether[] | undefined;
  isFetchingObjectsList?: boolean;
  onSearchResultClick?: (object: InventoryAndHierarchyObjectTogether) => void;
}

export const SearchPolygon = ({
  searchResult,
  isFetchingObjectsList,
  onSearchResultClick,
}: IProps) => {
  const translate = useTranslate();
  const gsRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState('');

  const { setSearchDashboard } = useDashboardBasedHierarchy();

  const [isExpanded, setIsExpanded] = useState(false);
  const debounceText = useDebounceValue(value);

  useEffect(() => {
    setSearchDashboard(debounceText);
  }, [debounceText]);

  const onSearchClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);

    if (!isExpanded) {
      inputRef.current?.focus();
    }
  };

  const getRenderIcon = () => {
    return isExpanded ? <CloseIcon color="primary" /> : <SearchIcon color="inherit" />;
  };

  const documentClickFn = useCallback(
    ({ target }: Event) => {
      const isClickOnBackdrop = (target as HTMLElement)?.classList?.contains('MuiBackdrop-root');
      if (gsRef.current && !gsRef.current.contains(target as Node) && !isClickOnBackdrop) {
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

  const onListItemClick = useCallback(
    (e: MouseEvent<HTMLDivElement>, item: InventoryAndHierarchyObjectTogether) => {
      onSearchResultClick?.(item);
      setSearchDashboard('');
    },
    [onSearchResultClick],
  );

  return (
    <SearchPolygonStyled ref={gsRef} state={isExpanded ? 'expanded' : 'collapsed'}>
      {!isExpanded ? (
        <SearchButton sx={{ cursor: 'pointer' }} color="primary" onClick={onSearchClick}>
          {getRenderIcon()}
        </SearchButton>
      ) : (
        <InputContainer
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <SearchField
            placeholder={translate('Search')}
            type="search"
            inputRef={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            fullWidth
            variant={isExpanded ? 'outlined' : 'standard'}
            size="small"
            autoFocus
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{!value && <SearchIcon />}</InputAdornment>
              ),
            }}
          />
          {isExpanded && debounceText.length > 0 && (
            <SearchPolygonList
              isExpanded={isExpanded}
              objectsList={searchResult}
              onListItemClick={onListItemClick}
              searchValue={debounceText}
              isFetchingObjectsList={isFetchingObjectsList}
            />
          )}
        </InputContainer>
      )}
    </SearchPolygonStyled>
  );
};
