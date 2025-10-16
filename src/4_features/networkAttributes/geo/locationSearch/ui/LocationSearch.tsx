import { useCallback, useState } from 'react';
import {
  Autocomplete,
  TextField,
  SxProps,
  Theme,
  IconButton,
  CircularProgress,
  styled,
  Popper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { IInventorySearchObjectModel, useDebounceValue, useTranslate } from '6_shared';
import { parseCoordinates, sortOptions } from '../lib';
import { useSearchData } from '../hooks';
import { IOption } from '../types';

const StyledPopper = styled(Popper)(({ theme }) => ({
  '& .MuiAutocomplete-groupLabel': {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    fontWeight: '600',
  },
}));

interface IProps {
  onSelectPlace?: (
    coords: number[] | null,
    selectedInventoryObject?: IInventorySearchObjectModel,
  ) => void;
  sx?: SxProps<Theme>;
  searchIcon?: boolean;
  visibleClearIcon?: boolean;
  disablePortal?: boolean;
  onClearSearchClick?: () => void;
  handleCloseContextMenu?: () => void;
}

export const LocationSearch = ({
  onSelectPlace,
  sx,
  searchIcon,
  visibleClearIcon,
  disablePortal,
  onClearSearchClick,
  handleCloseContextMenu,
}: IProps) => {
  const translate = useTranslate();
  const [value, setValue] = useState<IOption | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [coordinates, setCoordinates] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedSearchObject, setSelectedSearchObject] = useState<
    IInventorySearchObjectModel | undefined
  >();

  const debValue = useDebounceValue(inputValue);
  const debouncedCoordinates = useDebounceValue(coordinates);

  const {
    allOptions,
    inventoryObjectsData,
    setNewOffset,
    totalObjects,
    isInventoryObjectsDataFetching,
    objectOptionsLength,
  } = useSearchData({
    searchQuery: debValue.trim(),
  });

  const searchInventoryObject = (newSearchValue: string) => {
    const currentFeaturePlace = allOptions.find((o) => o.name === newSearchValue);
    if (currentFeaturePlace) {
      const selectedInventoryObject = inventoryObjectsData?.find(
        (item) => item.id.toString() === currentFeaturePlace.id,
      );
      setSelectedSearchObject(selectedInventoryObject);
      onSelectPlace?.(currentFeaturePlace.geometry.coordinates, selectedInventoryObject);
    }
  };

  const handleSearch = () => {
    handleCloseContextMenu?.();
    setOpen(false);
    if (!isInventoryObjectsDataFetching && allOptions.length) {
      searchInventoryObject(inputValue);
    }
    onSelectPlace?.(debouncedCoordinates);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
      setOpen(false);
    }
  };

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLUListElement>) => {
      const target = event.target as HTMLUListElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollTop + clientHeight === scrollHeight) {
        if (totalObjects && totalObjects > 50) {
          setNewOffset((prev) => prev + 50);
        }
      }
    },
    [setNewOffset, totalObjects],
  );

  const onClearClick = () => {
    handleCloseContextMenu?.();
    if (selectedSearchObject) onClearSearchClick?.();
    setValue(null);
    setInputValue('');
    setSelectedSearchObject(undefined);
  };

  return (
    <Autocomplete
      sx={sx}
      open={open}
      onOpen={() => {
        setOpen(true);
        handleCloseContextMenu?.();
      }}
      onClose={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      value={value}
      inputValue={inputValue}
      disablePortal={disablePortal}
      fullWidth
      options={allOptions.sort(sortOptions)}
      filterOptions={(options) => options}
      groupBy={(option) => option.group}
      getOptionLabel={(option) => `${option.name}${option.tmo_name ? `, ${option.tmo_name}` : ''}`}
      PopperComponent={StyledPopper}
      // clearIcon={
      //   visibleClearIcon ? <ClearIcon fontSize="small" sx={{ visibility: 'visible' }} /> : undefined
      // }
      renderInput={(params) => (
        <TextField
          {...params}
          label={translate('Search place')}
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              setOpen(true);
            }
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {visibleClearIcon && (
                  <IconButton onClick={onClearClick} sx={{ width: '28px', height: '28px' }}>
                    <ClearIcon fontSize="small" sx={{ visibility: 'visible' }} />
                  </IconButton>
                )}
                {searchIcon && (
                  <IconButton onClick={handleSearch} sx={{ width: '28px', height: '28px' }}>
                    <SearchIcon style={{ cursor: 'pointer' }} />
                  </IconButton>
                )}
                {isInventoryObjectsDataFetching ? (
                  <CircularProgress color="primary" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      onKeyDown={handleKeyDown}
      onChange={(e, val) => {
        if (val) searchInventoryObject(val.name);
      }}
      onInputChange={(e, val, reason) => {
        if (reason === 'input' && val === '') {
          setInputValue('');
        }
        if (val) {
          setInputValue(val);
          const newCoordinates = parseCoordinates(val);
          if (newCoordinates) {
            setCoordinates(newCoordinates);
          }
        }

        if (reason === 'clear') {
          setValue(null);
          setInputValue('');
        }
      }}
      loading={isInventoryObjectsDataFetching}
      ListboxProps={{
        onScroll:
          (totalObjects !== null && totalObjects >= 50) || objectOptionsLength === totalObjects
            ? handleScroll
            : undefined,
      }}
    />
  );
};
