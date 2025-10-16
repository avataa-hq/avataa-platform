import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, CircularProgress, TextField, useTheme } from '@mui/material';
import {
  useGetFullDataAboutMoLink,
  useGetObjectsByIds,
  useSearchObjectsByNameWithMisspelledWords,
} from '5_entites';
import { IObjectComponentParams, useDebounceValue } from '6_shared';
import { AutocompleteWrapper, Label, Wrapper } from '../../commonComponents';

interface IProps {
  param: IObjectComponentParams;
  duplicateObject: boolean;
}

interface ILinkToObjectOption {
  id: number;
  name: string;
}

export const LinkToObjectMultipleComponent = ({ param, duplicateObject }: IProps) => {
  const theme = useTheme();
  const { setValue, getValues } = useFormContext();

  const [linkToObjectOptions, setLinkToObjectOptions] = useState<ILinkToObjectOption[]>([]);
  const [linkToObjectSearchOptions, setLinkToObjectSearchOptions] = useState<ILinkToObjectOption[]>(
    [],
  );
  const [selectedOptions, setSelectedOptions] = useState<ILinkToObjectOption[]>(
    getValues(`${param.id.toString()}_${param.id}`) ?? [],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [newOffset, setNewOffset] = useState(0);
  const [totalObjects, setTotalObjects] = useState<number | null>(null);

  const debounceSearchValue = useDebounceValue(searchQuery);

  const { fullDataAboutMoLink, isFullDataAboutMoLinkFetching } = useGetFullDataAboutMoLink({
    parameterIds: [param.prm_id ?? 0],
    skip: !param.id,
  });

  const objectIdsFromParamValue = useMemo(() => {
    return Array.isArray(param.value) && !isNaN(param.value[0]) ? param.value : [];
  }, [param.value]);

  const { objectsByIdsData, isObjectsByIdsFetching } = useGetObjectsByIds({
    objectIds: objectIdsFromParamValue,
    skip: !objectIdsFromParamValue?.length,
  });

  const { objectsByNameWithMisspelledWordsData, isObjectsByNameWithMisspelledWordsFetching } =
    useSearchObjectsByNameWithMisspelledWords({
      searchValue: searchQuery.trim() === '' ? '  ' : debounceSearchValue.trim(),
      tmo_id: param.constraint !== null ? Number(param.constraint) : 0,
      offset: newOffset,
    });

  const isLoading =
    isFullDataAboutMoLinkFetching ||
    isObjectsByNameWithMisspelledWordsFetching ||
    isObjectsByIdsFetching;

  useEffect(() => {
    if (!objectsByIdsData) return;

    if (objectsByIdsData.length > 0) {
      const options = objectsByIdsData.map((item) => ({
        id: item.id,
        name: item.name,
      }));

      setSelectedOptions(options);
    }
  }, [objectsByIdsData]);

  useEffect(() => {
    if (fullDataAboutMoLink && param.prm_id) {
      const linkedObject = fullDataAboutMoLink[param.prm_id].linked_objects ?? [];

      if (linkedObject.length > 0) {
        const options = linkedObject.map((item) => ({
          id: item.linked_mo_id,
          name: item.linked_mo_name,
        }));

        if (!selectedOptions.length) setSelectedOptions(options);
      }
    }
  }, [fullDataAboutMoLink, param.prm_id, selectedOptions.length]);

  useEffect(() => {
    if (!objectsByNameWithMisspelledWordsData) return;
    setTotalObjects(objectsByNameWithMisspelledWordsData.metadata.total_hits);

    const newSearchOptions: ILinkToObjectOption[] =
      objectsByNameWithMisspelledWordsData?.objects.map((item) => ({
        id: item.id,
        name: item.name,
      }));

    if (searchQuery.trim()) {
      setNewOffset(0);
      setLinkToObjectOptions([]);
      setLinkToObjectSearchOptions(newSearchOptions);
    } else {
      setLinkToObjectOptions((prev) => {
        const updatedOptions = [...prev];
        newSearchOptions.forEach((newOption) => {
          if (!prev.some((option) => option.id === newOption.id)) {
            updatedOptions.push(newOption);
          }
        });
        return updatedOptions;
      });
    }
  }, [objectsByNameWithMisspelledWordsData, searchQuery]);

  useEffect(() => {
    if (duplicateObject && selectedOptions) {
      setValue(
        param.id.toString(),
        selectedOptions.map((item) => item.id),
      );
    }
  }, [duplicateObject, param.id, selectedOptions, setValue]);

  /**
   * Handles the scrolling event of a container.
   * @param {React.UIEvent<HTMLUListElement>} event - The scroll event.
   */
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLUListElement>) => {
      const target = event.target as HTMLUListElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollTop + clientHeight === scrollHeight) {
        setNewOffset((prev) => prev + 50);
      }
    },
    [setNewOffset],
  );

  return (
    <Wrapper sx={{ position: 'relative' }}>
      <Label>{param.name}</Label>
      <AutocompleteWrapper sx={{ width: '60%' }}>
        <Autocomplete
          multiple
          disablePortal
          disableCloseOnSelect
          onClose={() => setSearchQuery('')}
          value={selectedOptions}
          getOptionLabel={(option) => option.name ?? ''}
          filterOptions={(options) => options}
          onChange={(event, newValue) => {
            setSelectedOptions([...newValue]);
            setValue(
              param.id.toString(),
              newValue.map((option) => option.id),
            );
            setValue(`${param.id.toString()}_${param.id}`, newValue);
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'input') setSearchQuery(value);
            if (reason === 'clear') setSearchQuery('');
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={!searchQuery.trim() ? linkToObjectOptions : linkToObjectSearchOptions}
          loading={isLoading}
          ListboxProps={{
            onScroll:
              (totalObjects !== null && totalObjects >= 50) ||
              linkToObjectOptions.length === totalObjects
                ? handleScroll
                : undefined,
          }}
          renderInput={(params) => (
            <TextField
              variant="outlined"
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress color="primary" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          sx={{
            backgroundColor: theme.palette.neutral.surfaceContainerLowestVariant2,
            borderRadius: '10px',
            '.MuiInputBase-root': {
              minHeight: '24px',
              height: 'auto',
            },
            '.MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
              padding: '0 34px 0 6px',
            },
            '.MuiChip-root': {
              fontSize: '12px',
              height: 'max-content',
              margin: '2px',
              '.MuiSvgIcon-root': {
                fontSize: '16px',
              },
            },
          }}
        />
      </AutocompleteWrapper>
    </Wrapper>
  );
};
