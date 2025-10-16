import { ChangeEvent, useEffect, useState } from 'react';
import { Divider, Theme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslate } from '6_shared/localization';
import { SxProps } from '@mui/system';
import { SearchContainer, SearchIconButton, SearchInput } from './Search.styled';

interface SearchProps {
  searchValue: string;
  onSearchClick: (value: string) => void;
  onCancelClick: () => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export const Search = ({
  searchValue,
  onSearchClick,
  onCancelClick,
  disabled = false,
  sx,
}: SearchProps) => {
  const translate = useTranslate();
  const [localSearchValue, setLocalSearchValue] = useState<string>('');

  const handleSearch = () => {
    const trimmedValue = localSearchValue.trim();
    onSearchClick(trimmedValue);
  };

  const onCancel = () => {
    setLocalSearchValue('');
    onCancelClick();
  };

  useEffect(() => {
    if (searchValue) {
      setLocalSearchValue(searchValue);
    } else {
      setLocalSearchValue('');
    }
  }, [searchValue]);

  return (
    <SearchContainer sx={sx}>
      <SearchInput
        value={localSearchValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setLocalSearchValue(event.target.value);
        }}
        placeholder={translate('Search')}
        disabled={disabled}
        onKeyDown={({ key }) => {
          if (key === 'Enter') handleSearch();
        }}
      />
      <SearchIconButton color="primary" onClick={() => onSearchClick(localSearchValue)}>
        <SearchIcon color="primary" />
      </SearchIconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <SearchIconButton color="primary" onClick={onCancel}>
        <CloseIcon color="primary" />
      </SearchIconButton>
    </SearchContainer>
  );
};
