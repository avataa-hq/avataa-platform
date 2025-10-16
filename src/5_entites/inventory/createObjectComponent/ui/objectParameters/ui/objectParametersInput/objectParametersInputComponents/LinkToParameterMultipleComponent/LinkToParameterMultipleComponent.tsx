import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, CircularProgress, TextField, useTheme } from '@mui/material';
import {
  useGetFullDataAboutPrmLink,
  useGetObjectsByTprmIdAndPrmValue,
  useGetParameterData,
} from '5_entites';
import { IObjectComponentParams, ObjectByTprmIdAndPrmValue, useDebounceValue } from '6_shared';
import { AutocompleteWrapper, Label, Wrapper } from '../../commonComponents';

interface IProps {
  param: IObjectComponentParams;
}

export const LinkToParameterMultipleComponent = ({ param }: IProps) => {
  const theme = useTheme();

  const { setValue, getValues } = useFormContext();
  const [linkToParamOptions, setLinkToParamOptions] = useState<ObjectByTprmIdAndPrmValue[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<ObjectByTprmIdAndPrmValue[]>(
    getValues(`${param.id.toString()}_${param.id}`) ?? [],
  );
  const [newOffset, setNewOffset] = useState(0);
  const [totalObjects, setTotalObjects] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounceValue(searchQuery);

  const { fullDataAboutPrmLink, isFullDataAboutPrmLinkFetching } = useGetFullDataAboutPrmLink({
    parameterIds: [param.prm_id ?? 0],
    skip: !param.prm_id,
  });

  const paramIds = useMemo(
    () => (Array.isArray(param.value) && !isNaN(param.value[0]) ? param.value : []),
    [param.value],
  );

  const { parametersData, isParametersDataFetching } = useGetParameterData({
    paramIds,
    skip: !paramIds.length,
  });

  const { objectsByTprmIdAndPrmValueData, isObjectsByTprmIdAndPrmValueFetching } =
    useGetObjectsByTprmIdAndPrmValue({
      tprm_id: param.constraint !== null ? Number(param.constraint.split(':')[1]) : null,
      value: debouncedSearchQuery,
      newOffset,
      skip: !param.constraint || (totalObjects != null && newOffset >= totalObjects),
    });

  const isLoading =
    isObjectsByTprmIdAndPrmValueFetching ||
    isFullDataAboutPrmLinkFetching ||
    isParametersDataFetching;

  useEffect(() => {
    if (!parametersData) return;
    const options = parametersData.map((item) => ({
      prm_id: item.prm_id,
      mo_id: item.mo_id,
      mo_name: item.mo_name,
      prm_value: item.value,
    }));
    setSelectedOptions(options);
    setValue(
      param.id.toString(),
      options.map((option) => option.prm_id),
    );
  }, [param.id, parametersData, setValue]);

  /**
   * This `useEffect` block is responsible for initializing the selected options and
   * current parameter options in the autocomplete component based on fetched data for objects by tprm_id ID.
   */
  useEffect(() => {
    if (fullDataAboutPrmLink && param.prm_id) {
      const linked_parameters = fullDataAboutPrmLink[param.prm_id]?.linked_parameters ?? [];

      if (linked_parameters.length > 0) {
        const currentOptions = linked_parameters.map((item) => ({
          prm_id: item.linked_prm_id,
          mo_id: item.linked_mo_id,
          mo_name: item.linked_mo_name,
          prm_value: item.linked_prm_value,
        }));

        if (!selectedOptions.length) setSelectedOptions(currentOptions);
      }
    }
  }, [fullDataAboutPrmLink, param, selectedOptions.length]);

  /**
   * This `useEffect` block is responsible for updating the options in the autocomplete component
   * based on fetched data for objects filtered by tprm_id ID and value.
   */
  useEffect(() => {
    if (!objectsByTprmIdAndPrmValueData || objectsByTprmIdAndPrmValueData.data.length === 0) return;
    setTotalObjects(objectsByTprmIdAndPrmValueData.total);
    setLinkToParamOptions((prev) => {
      const updatedOptions = [...prev];
      objectsByTprmIdAndPrmValueData.data.forEach((newOption) => {
        if (!prev.some((option) => option.prm_id === newOption.prm_id)) {
          updatedOptions.push(newOption);
        }
      });
      return updatedOptions;
    });
  }, [objectsByTprmIdAndPrmValueData]);

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
          value={selectedOptions}
          loading={isLoading}
          getOptionLabel={(option) => `${option.mo_name}: ${option.prm_value}`}
          onChange={(event, newValue) => {
            setSelectedOptions([...newValue]);
            setValue(
              param.id.toString(),
              newValue.map((option) => option.prm_id),
            );
            setValue(`${param.id.toString()}_${param.id.toString()}`, newValue);
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'input') setSearchQuery(value);
          }}
          isOptionEqualToValue={(option, value) => option.prm_id === value.prm_id}
          options={linkToParamOptions}
          ListboxProps={{ onScroll: handleScroll }}
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
