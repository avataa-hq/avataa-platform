import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, CircularProgress, TextField, Typography, useTheme } from '@mui/material';
import {
  AutocompleteWrapper,
  useGetFullDataAboutPrmLink,
  useGetObjectsByTprmIdAndPrmValue,
  useGetParameterData,
} from '5_entites';
import {
  IObjectComponentParams,
  ObjectByTprmIdAndPrmValue,
  ObjectCRUDModeType,
  useDebounceValue,
  useTranslate,
} from '6_shared';
import { ErrorMessage, Label, Wrapper } from '../../commonComponents';

interface IProps {
  param: IObjectComponentParams;
  duplicateObject: boolean;
  objectCRUDComponentMode: ObjectCRUDModeType;
}

export const LinkToParameterComponent = ({
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
  } = useFormContext();
  const [linkToParamOptions, setLinkToParamOptions] = useState<ObjectByTprmIdAndPrmValue[]>([]);
  const [selectedOption, setSelectedOption] = useState<ObjectByTprmIdAndPrmValue | null>(
    getValues(`${param.id.toString()}_${param.id}`) ?? null,
  );
  const [newOffset, setNewOffset] = useState(0);
  const [totalObjects, setTotalObjects] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounceValue(searchQuery);

  const { fullDataAboutPrmLink, isFullDataAboutPrmLinkFetching } = useGetFullDataAboutPrmLink({
    parameterIds: [param.prm_id ?? 0],
    skip: !param.id || objectCRUDComponentMode === 'creating',
  });

  const paramIds = useMemo(
    () => (param.value && !isNaN(param.value) ? [Number(param.value)] : []),
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
    if (parametersData.length > 0) {
      const option = {
        prm_id: parametersData[0].prm_id,
        mo_id: parametersData[0].mo_id,
        mo_name: parametersData[0].mo_name,
        prm_value: parametersData[0].value,
      };
      setSelectedOption(option);
      setValue(param.id.toString(), option.prm_id);
    }
  }, [param.id, parametersData, setValue]);

  /**
   * This `useEffect` block is responsible for initializing the selected option in the autocomplete component.
   */
  useEffect(() => {
    if (fullDataAboutPrmLink && param.prm_id) {
      const linked_parameters = fullDataAboutPrmLink[param.prm_id]?.linked_parameters ?? [];

      if (linked_parameters.length > 0) {
        const { linked_prm_id, linked_mo_id, linked_mo_name, linked_prm_value } =
          linked_parameters[0];

        const currentOption = {
          prm_id: linked_prm_id,
          mo_id: linked_mo_id,
          mo_name: linked_mo_name,
          prm_value: linked_prm_value,
        };

        setSelectedOption(currentOption);
      }
    }
  }, [fullDataAboutPrmLink, param]);

  /**
   * This `useEffect` block is responsible for updating the available options in the autocomplete component
   *  based on data fetched from the server.
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

  /**
   * This useEffect function serves the purpose of ensuring that a specific option,
   * identified by its prm_id, is included in the linkToParamOptions state array.
   * If the selected option does not already exist in linkToParamOptions, it will be added to the array.
   */
  useEffect(() => {
    if (linkToParamOptions.length !== 0 && selectedOption !== null) {
      const currentOption = linkToParamOptions.find(
        (item) => item.prm_id === selectedOption.prm_id,
      );
      if (!currentOption) {
        const newLinkToParamOptions = [...linkToParamOptions, selectedOption];
        setLinkToParamOptions(newLinkToParamOptions);
      }
    }
  }, [linkToParamOptions, selectedOption]);

  useEffect(() => {
    if (duplicateObject && selectedOption) {
      setValue(param.id.toString(), selectedOption.prm_id);
    }
  }, [duplicateObject, param.id, selectedOption, setValue]);

  return (
    <Wrapper sx={{ position: 'relative' }}>
      <Label>{param.name}</Label>
      <AutocompleteWrapper sx={{ width: '60%' }}>
        <Autocomplete
          value={selectedOption}
          getOptionLabel={(option) => `${option.mo_name}: ${option.prm_value}`}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedOption(newValue);
              setValue(param.id.toString(), newValue.prm_id);
              setValue(`${param.id.toString()}_${param.id}`, newValue);
            }
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'input' && value) setSearchQuery(value);
          }}
          isOptionEqualToValue={(option, value) => option.prm_value === value.prm_value}
          options={linkToParamOptions}
          ListboxProps={{ onScroll: handleScroll }}
          loading={isLoading}
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
          renderOption={(props, option) => (
            <li {...props} key={`${option.mo_name}: ${option.prm_value}`}>
              <Typography>{`${option.mo_name}: ${option.prm_value}`}</Typography>
            </li>
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
