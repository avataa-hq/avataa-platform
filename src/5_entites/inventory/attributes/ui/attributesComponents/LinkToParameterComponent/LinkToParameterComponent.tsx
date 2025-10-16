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
  isMultipleEdit?: boolean;
  endButtonSlot?: React.ReactNode;
  customWrapperStyles?: React.CSSProperties;
  testid?: string;
}

export const LinkToParameterComponent = ({
  param,
  isEdited,
  onDeleteClick,
  createTooltipText,
  showDeleteButton = true,
  endButtonSlot,
  isMultipleEdit,
  customWrapperStyles,
  testid,
}: IProps) => {
  const theme = useTheme();
  const [linkToParamOptions, setLinkToParamOptions] = useState<ObjectByTprmIdAndPrmValue[]>([]);
  const [selectedOption, setSelectedOption] = useState<ObjectByTprmIdAndPrmValue | null>(null);
  const [newOffset, setNewOffset] = useState(0);
  const [totalObjects, setTotalObjects] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounceValue(searchQuery);

  const { setValue, clearErrors } = useFormContext();

  const { fullDataAboutPrmLink, isFullDataAboutPrmLinkFetching } = useGetFullDataAboutPrmLink({
    parameterIds: [param.prm_id ?? 0],
    skip: !param.prm_id,
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
    if (parametersData.length > 0) {
      const option = {
        prm_id: parametersData[0].prm_id,
        mo_id: parametersData[0].mo_id,
        mo_name: parametersData[0].mo_name,
        prm_value: parametersData[0].value,
      };
      setSelectedOption(option);
    }
  }, [parametersData]);

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

        if (isMultipleEdit) {
          setSelectedOption(null);
        } else {
          setSelectedOption(currentOption);
        }
      }
    }
  }, [fullDataAboutPrmLink, isMultipleEdit, param]);

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

  return (
    <AutocompleteWrapper
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        paddingRight: showDeleteButton || endButtonSlot ? 0 : '40px',
      }}
      style={{ ...customWrapperStyles }}
    >
      <CustomTooltip
        tooltipText={
          createTooltipText?.({
            paramValType: param.val_type,
            paramConstraint: param.constraint,
          }) ?? ''
        }
      >
        <Autocomplete
          value={selectedOption}
          disabled={!isEdited}
          getOptionLabel={(option) =>
            option.mo_name ? `${option.mo_name}: ${option.prm_value}` : ''
          }
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedOption(newValue);
              setValue(param.tprm_id.toString(), newValue.prm_id);
              clearErrors(param.tprm_id.toString());
            }
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'input' && value) setSearchQuery(value);
          }}
          isOptionEqualToValue={(option, value) => option.prm_value === value.prm_value}
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
              data-testid={testid}
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
            width: '100%',
          }}
        />
      </CustomTooltip>
      {showDeleteButton && <DeleteButton onClick={() => onDeleteClick?.(param.tprm_id)} />}
      {endButtonSlot}
    </AutocompleteWrapper>
  );
};
