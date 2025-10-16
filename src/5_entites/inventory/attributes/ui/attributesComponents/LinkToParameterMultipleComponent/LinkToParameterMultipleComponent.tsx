import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, CircularProgress, TextField, useTheme } from '@mui/material';
import { ObjectByTprmIdAndPrmValue, useDebounceValue } from '6_shared';
import {
  AutocompleteWrapper,
  CustomTooltip,
  DeleteButton,
  ICreateTooltipTextProps,
  IParams,
  useGetFullDataAboutPrmLink,
  useGetObjectsByTprmIdAndPrmValue,
  useGetParameterData,
} from '5_entites';

interface IProps {
  param: IParams;
  isEdited?: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  createTooltipText?: ({ paramValType, paramConstraint }: ICreateTooltipTextProps) => string;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
  isMultipleEdit?: boolean;
}

export const LinkToParameterMultipleComponent = ({
  param,
  isEdited,
  onDeleteClick,
  createTooltipText,
  showDeleteButton = true,
  endButtonSlot,
  isMultipleEdit,
}: IProps) => {
  const theme = useTheme();
  const [linkToParamOptions, setLinkToParamOptions] = useState<ObjectByTprmIdAndPrmValue[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<ObjectByTprmIdAndPrmValue[]>([]);
  const [newOffset, setNewOffset] = useState(0);
  const [totalObjects, setTotalObjects] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounceValue(searchQuery);

  const { setValue } = useFormContext();

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
      tprm_id: Number(param.constraint?.split(':')[1] || param.constraint),
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
  }, [parametersData]);

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

        if (isMultipleEdit) {
          setSelectedOptions([]);
        } else {
          setSelectedOptions(currentOptions);
        }
      }
    }
  }, [fullDataAboutPrmLink, isMultipleEdit, param]);

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
    <CustomTooltip
      tooltipText={
        createTooltipText?.({
          paramValType: param.val_type,
          paramConstraint: param.constraint,
        }) ?? ''
      }
    >
      <AutocompleteWrapper
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          paddingRight: showDeleteButton || endButtonSlot ? 0 : '40px',
        }}
      >
        <Autocomplete
          multiple
          disableCloseOnSelect
          disabled={!isEdited}
          value={selectedOptions}
          getOptionLabel={(option) => `${option.mo_name ?? ''}: ${option.prm_value ?? ''}`}
          onChange={(event, newValue) => {
            setSelectedOptions([...newValue]);
            setValue(
              param.tprm_id.toString(),
              newValue.map((option) => option.prm_id),
            );
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'input') setSearchQuery(value);
          }}
          isOptionEqualToValue={(option, value) => option.prm_id === value.prm_id}
          options={linkToParamOptions}
          loading={isLoading}
          ListboxProps={{
            onScroll:
              (totalObjects !== null && totalObjects >= 50) ||
              linkToParamOptions.length === totalObjects
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
            width: '80%',
            flexGrow: 1,
          }}
        />
        {showDeleteButton && <DeleteButton onClick={() => onDeleteClick?.(param.tprm_id)} />}
        {endButtonSlot}
      </AutocompleteWrapper>
    </CustomTooltip>
  );
};
