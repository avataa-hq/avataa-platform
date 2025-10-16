import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress, useTheme, Typography } from '@mui/material';
import {
  AutocompleteWrapper,
  CustomTooltip,
  DeleteButton,
  ICreateTooltipTextProps,
  IParams,
  useGetFullDataAboutMoLink,
  useGetFullDataAboutTwoWayMoLink,
  useGetObjectsByIds,
  useSearchObjectsByNameWithMisspelledWords,
} from '5_entites';
import { useDebounceValue } from '6_shared';

interface IProps {
  param: IParams;
  isEdited?: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  createTooltipText?: ({ paramValType, paramConstraint }: ICreateTooltipTextProps) => string;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
  customWrapperStyles?: React.CSSProperties;
  testid?: string;
}

interface ILinkToObjectOption {
  id: number;
  name: string;
}

export const LinkToObjectComponent = ({
  param,
  isEdited,
  onDeleteClick,
  createTooltipText,
  showDeleteButton = true,
  endButtonSlot,
  customWrapperStyles,
  testid,
}: IProps) => {
  const theme = useTheme();
  const { control, setValue, clearErrors } = useFormContext();

  const [linkToObjectOptions, setLinkToObjectOptions] = useState<ILinkToObjectOption[]>([]);
  const [linkToObjectSearchOptions, setLinkToObjectSearchOptions] = useState<ILinkToObjectOption[]>(
    [],
  );
  const [selectedOption, setSelectedOption] = useState<ILinkToObjectOption | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newOffset, setNewOffset] = useState(0);
  const [totalObjects, setTotalObjects] = useState<number | null>(null);
  // const [onChangeReason, setOnChangeReason] = useState<AutocompleteChangeReason | null>(null);

  const debounceSearchValue = useDebounceValue(searchQuery);

  const { fullDataAboutMoLink, isFullDataAboutMoLinkFetching } = useGetFullDataAboutMoLink({
    parameterIds: [param.prm_id ?? 0],
    skip: !param.prm_id || param.val_type === 'two-way link',
  });

  const { fullDataAboutTwoWayMoLink, isFullDataAboutTwoWayMoLinkFetching } =
    useGetFullDataAboutTwoWayMoLink({
      parameterIds: [param.prm_id ?? 0],
      skip: !param.prm_id || param.val_type === 'mo_link',
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
      searchValue: searchQuery.trim() === '' ? '  ' : debounceSearchValue.trim(),
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
    if (!param.prm_id) return;

    let option: { id: number; name: string } | null = null;

    const linkedObjects = fullDataAboutMoLink?.[param.prm_id]?.linked_objects ?? [];
    if (linkedObjects.length > 0) {
      const { linked_mo_id, linked_mo_name } = linkedObjects[0];
      option = { id: linked_mo_id, name: linked_mo_name };
    }

    const linkedObject = fullDataAboutTwoWayMoLink?.[param.prm_id]?.linked_object;
    if (linkedObject) {
      const { linked_mo_id, linked_mo_name } = linkedObject;
      option = { id: linked_mo_id, name: linked_mo_name };
    }

    if (option) {
      setSelectedOption(option);
    }
  }, [param.prm_id, fullDataAboutMoLink, fullDataAboutTwoWayMoLink]);

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

  /**
   * Handles the scrolling event of a container.
   * @param {React.UIEvent<HTMLUListElement>} event - The scroll event.
   */
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLUListElement>) => {
      const target = event.target as HTMLUListElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollTop + clientHeight === scrollHeight && !searchQuery.trim()) {
        setNewOffset((prev) => prev + 50);
      }
    },
    [setNewOffset, searchQuery],
  );

  return (
    <Controller
      control={control}
      name={param.tprm_id.toString()}
      render={({ field: { onChange, ...field }, fieldState }) => (
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
              {...field}
              value={selectedOption}
              onClose={() => setSearchQuery('')}
              getOptionLabel={(option) => option.name ?? ''}
              filterOptions={(options) => options}
              disabled={!isEdited}
              onChange={(event, newValue) => {
                onChange(newValue?.id);
                if (newValue) {
                  setSelectedOption(newValue);
                  setValue(param.tprm_id.toString(), newValue.id);
                  clearErrors(param.tprm_id.toString());
                }
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
                  linkToObjectSearchOptions.length === totalObjects ||
                  !searchQuery.trim()
                    ? handleScroll
                    : undefined,
              }}
              renderInput={(params) => (
                <TextField
                  variant="outlined"
                  data-testid={testid}
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
                width: '100%',
              }}
            />
          </CustomTooltip>

          {showDeleteButton && <DeleteButton onClick={() => onDeleteClick?.(param.tprm_id)} />}
          {endButtonSlot}

          {fieldState.error && (
            <Typography fontSize={10} color="error">
              {fieldState.error.message}
            </Typography>
          )}
        </AutocompleteWrapper>
      )}
    />
  );
};
