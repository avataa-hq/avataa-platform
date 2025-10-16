import { MouseEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import { SearchRounded, Close } from '@mui/icons-material';

import { useDebounceValue, useTranslate } from '6_shared';

interface SearchInputProps<T extends Record<string, any>> {
  data?: T[];
  onChange: (value: T[], searchValue?: string) => void;
  searchedProperty?: keyof T | (keyof T)[];
  expandable?: boolean;
}

export const SearchInput = <T extends Record<string, any>>({
  data,
  onChange,
  searchedProperty,
  expandable = false,
}: SearchInputProps<T>) => {
  const translate = useTranslate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue = useDebounceValue(searchValue);

  const filteredData = useMemo(() => {
    if (debouncedSearchValue !== undefined && debouncedSearchValue.trim()?.length > 0) {
      if (!data || !searchedProperty) return null;

      return data.filter((d) => {
        if (Array.isArray(searchedProperty)) {
          return searchedProperty.some((property) =>
            d[property]?.toString()?.toLowerCase().includes(debouncedSearchValue.toLowerCase()),
          );
        }
        return typeof d[searchedProperty] === 'string'
          ? d[searchedProperty]?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          : false;
      });
    }
    return data || null;
  }, [data, debouncedSearchValue, searchedProperty]);

  useEffect(() => {
    onChange(filteredData ?? [], debouncedSearchValue);
    // onChange in deps array will cause re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData, debouncedSearchValue]);

  const handleSearchIconClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    if (!isExpanded) inputRef.current?.focus();
  };

  const handleFieldBlur = () => {
    if (expandable && !searchValue?.trim()?.length && isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleFieldFocus = () => {
    if (expandable && !isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleClearIconClick = () => {
    setSearchValue('');
  };

  return (
    <TextField
      placeholder={translate('Search')}
      sx={
        expandable
          ? {
              width: isExpanded ? '150px' : '40px',
              transition: 'width 0.2s ease-in-out',

              '& fieldset': {
                transition: 'border-color 0.2s ease-in-out',
                ...(!isExpanded && { borderColor: 'transparent' }),
              },

              '& .MuiInputBase-root:hover fieldset': {
                ...(!isExpanded && { borderColor: 'transparent' }),
              },
            }
          : undefined
      }
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      InputProps={{
        endAdornment: (
          <>
            {searchValue?.trim() === '' && (
              <IconButton onClick={handleSearchIconClick} sx={{ width: '30px', height: '30px' }}>
                <SearchRounded sx={{ ...(expandable && { cursor: 'pointer' }) }} />
              </IconButton>
            )}
            {searchValue?.trim() !== '' && (
              <IconButton onClick={handleClearIconClick} sx={{ width: '30px', height: '30px' }}>
                <Close sx={{ ...(expandable && { cursor: 'pointer' }) }} />
              </IconButton>
            )}
          </>
        ),
      }}
      onBlur={handleFieldBlur}
      onFocus={handleFieldFocus}
      inputRef={inputRef}
    />
  );
};
