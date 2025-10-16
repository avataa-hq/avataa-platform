import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress, useTheme } from '@mui/material';
import {
  useGetFullDataAboutMoLink,
  useGetFullDataAboutTwoWayMoLink,
  useGetObjectsByIds,
  useSearchObjectsByNameWithMisspelledWords,
} from '5_entites';
import {
  IObjectComponentParams,
  ObjectCRUDModeType,
  useDebounceValue,
  useTranslate,
} from '6_shared';
import { AutocompleteWrapper, ErrorMessage, Label, Wrapper } from '../../commonComponents';

interface IProps {
  param: IObjectComponentParams;
  duplicateObject: boolean;
  objectCRUDComponentMode: ObjectCRUDModeType;
}

interface ILinkToObjectOption {
  id: number | undefined;
  name: string | undefined;
}

export const LinkToObjectComponent = ({
  param,
  duplicateObject,
  objectCRUDComponentMode,
}: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();

  const {
    setValue,
    getValues,
    formState: { errors },
    clearErrors,
  } = useFormContext();
  const [linkToObjectSearchOptions, setLinkToObjectSearchOptions] = useState<ILinkToObjectOption[]>(
    [],
  );
  const [selectedOption, setSelectedOption] = useState<ILinkToObjectOption | null>(
    getValues(`${param.id.toString()}_${param.id}`) ?? null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [newOffset, setNewOffset] = useState(0);
  const [totalObjects, setTotalObjects] = useState<number | null>(null);

  useEffect(() => {
    if (!param.prm_id || !param.id) {
      setSelectedOption(null);
    }
  }, [param]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchQuery('   ');
    }
  }, [searchQuery]);

  const debounceSearchValue = useDebounceValue(searchQuery);

  const { fullDataAboutMoLink, isFullDataAboutMoLinkFetching } = useGetFullDataAboutMoLink({
    parameterIds: [param.prm_id ?? 0],
    skip:
      !param.id ||
      (objectCRUDComponentMode === 'creating' && !duplicateObject) ||
      param.val_type === 'two-way link',
  });

  const { fullDataAboutTwoWayMoLink, isFullDataAboutTwoWayMoLinkFetching } =
    useGetFullDataAboutTwoWayMoLink({
      parameterIds: [param.prm_id ?? 0],
      skip:
        !param.prm_id ||
        (objectCRUDComponentMode === 'creating' && !duplicateObject) ||
        param.val_type === 'mo_link',
    });

  const objectIdsFromParamValue = useMemo(() => {
    return isNaN(param.value) ? [] : [Number(param.value)];
  }, [param.value]);

  const { objectsByIdsData, isObjectsByIdsFetching } = useGetObjectsByIds({
    objectIds: objectIdsFromParamValue,
    skip: !objectIdsFromParamValue.length,
  });

  const { objectsByNameWithMisspelledWordsData, isObjectsByNameWithMisspelledWordsFetching } =
    useSearchObjectsByNameWithMisspelledWords({
      searchValue: debounceSearchValue,
      tmo_id: param.constraint !== null ? Number(param.constraint) : 0,
      offset: newOffset,
    });

  const isLoading =
    isFullDataAboutMoLinkFetching ||
    isObjectsByNameWithMisspelledWordsFetching ||
    isFullDataAboutTwoWayMoLinkFetching ||
    isObjectsByIdsFetching;

  useEffect(() => {
    if (!objectsByIdsData) return;

    if (objectsByIdsData.length > 0) {
      const option = {
        id: objectsByIdsData[0].id,
        name: objectsByIdsData[0].name,
      };

      setSelectedOption(option);
    }
  }, [objectsByIdsData]);

  useEffect(() => {
    if (fullDataAboutMoLink && param.prm_id) {
      const linkedObject = fullDataAboutMoLink[param.prm_id]?.linked_objects ?? [];

      if (linkedObject.length > 0) {
        const { linked_mo_id, linked_mo_name } = linkedObject[0];

        const option = {
          id: linked_mo_id,
          name: linked_mo_name,
        };
        if (!selectedOption) setSelectedOption(option);
      }
    }
  }, [fullDataAboutMoLink, param.prm_id, selectedOption]);

  useEffect(() => {
    if (fullDataAboutTwoWayMoLink && param.prm_id) {
      const linkedObject = fullDataAboutTwoWayMoLink[param.prm_id]?.linked_object;

      if (linkedObject) {
        const { linked_mo_id, linked_mo_name } = linkedObject;

        const option = {
          id: linked_mo_id,
          name: linked_mo_name,
        };
        if (!selectedOption) setSelectedOption(option);
      }
    }
  }, [fullDataAboutTwoWayMoLink, param.prm_id, selectedOption]);

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
      setLinkToObjectSearchOptions(newSearchOptions);
    }

    setLinkToObjectSearchOptions((prev) => {
      const updatedOptions = [...prev];
      newSearchOptions.forEach((newOption) => {
        if (!prev.some((option) => option.id === newOption.id)) {
          updatedOptions.push(newOption);
        }
      });
      return updatedOptions;
    });
  }, [objectsByNameWithMisspelledWordsData, searchQuery]);

  useEffect(() => {
    if (duplicateObject && selectedOption) {
      setValue(param.id.toString(), selectedOption.id);
    }
  }, [duplicateObject, param.id, selectedOption, setValue]);

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

  /**
   * This useEffect function serves the purpose of ensuring that a specific option,
   * identified by its id, is included in the linkToObjectOptions state array.
   * If the selected option does not already exist in linkToObjectOptions, it will be added to the array.
   */
  useEffect(() => {
    if (linkToObjectSearchOptions.length !== 0 && selectedOption !== null) {
      const currentOption = linkToObjectSearchOptions.find((item) => item.id === selectedOption.id);
      if (!currentOption) {
        const newLinkToObjectOptions = [...linkToObjectSearchOptions, selectedOption];
        setLinkToObjectSearchOptions(newLinkToObjectOptions);
      }
    }
  }, [linkToObjectSearchOptions, selectedOption]);

  return (
    <Wrapper sx={{ position: 'relative' }}>
      <Label>{param.name}</Label>
      <AutocompleteWrapper sx={{ width: '60%' }}>
        <Autocomplete
          value={selectedOption}
          onClose={() => setSearchQuery('   ')}
          getOptionLabel={(option) => option.name ?? ''}
          filterOptions={(options) => options}
          disableClearable={searchQuery === ''}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedOption(newValue);
              setValue(param.id.toString(), newValue.id);
              setValue(`${param.id.toString()}_${param.id}`, newValue);
              clearErrors(param.id.toString());
            }
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'input') {
              setSearchQuery(value);
            }
            if (reason === 'clear') {
              setSearchQuery('');
            }
          }}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          options={linkToObjectSearchOptions}
          loading={isLoading}
          ListboxProps={{
            onScroll:
              (totalObjects !== null && totalObjects >= 50) ||
              linkToObjectSearchOptions.length === totalObjects
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
              height: '24px',
              padding: '0 34px 0 6px',
            },
            '.MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
              padding: '0 34px 0 6px',
            },
          }}
        />

        {errors?.[param.id.toString()] && (
          <ErrorMessage color="error">{translate('This field is required')}</ErrorMessage>
        )}
      </AutocompleteWrapper>
    </Wrapper>
  );
};
