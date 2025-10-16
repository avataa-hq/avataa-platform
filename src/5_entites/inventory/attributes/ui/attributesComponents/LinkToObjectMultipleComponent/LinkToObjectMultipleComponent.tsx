import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, CircularProgress, TextField, useTheme } from '@mui/material';
import {
  AutocompleteWrapper,
  CustomTooltip,
  DeleteButton,
  ICreateTooltipTextProps,
  IParams,
  useGetFullDataAboutMoLink,
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
}

interface ILinkToObjectOption {
  id: number;
  name: string;
}

export const LinkToObjectMultipleComponent = ({
  param,
  isEdited,
  onDeleteClick,
  createTooltipText,
  showDeleteButton = true,
  endButtonSlot,
}: IProps) => {
  const theme = useTheme();
  const { setValue } = useFormContext();
  const [linkToObjectOptions, setLinkToObjectOptions] = useState<ILinkToObjectOption[]>([]);
  const [linkToObjectSearchOptions, setLinkToObjectSearchOptions] = useState<ILinkToObjectOption[]>(
    [],
  );
  const [selectedOptions, setSelectedOptions] = useState<ILinkToObjectOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newOffset, setNewOffset] = useState(0);
  const [totalObjects, setTotalObjects] = useState<number | null>(null);

  const debounceSearchValue = useDebounceValue(searchQuery);

  const { fullDataAboutMoLink, isFullDataAboutMoLinkFetching } = useGetFullDataAboutMoLink({
    parameterIds: [param.prm_id ?? 0],
    skip: !param.prm_id,
  });

  const { objectsByNameWithMisspelledWordsData, isObjectsByNameWithMisspelledWordsFetching } =
    useSearchObjectsByNameWithMisspelledWords({
      searchValue: searchQuery.trim() === '' ? '  ' : debounceSearchValue.trim(),
      tmo_id: param.constraint !== null ? Number(param.constraint) : 0,
      offset: newOffset,
    });

  const objectIdsFromParamValue = useMemo(() => {
    return Array.isArray(param.value) && !isNaN(param.value[0]) ? param.value : [];
  }, [param.value]);

  const { objectsByIdsData, isObjectsByIdsFetching } = useGetObjectsByIds({
    objectIds: objectIdsFromParamValue,
    skip: !objectIdsFromParamValue?.length,
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

        setSelectedOptions(options);
      }
    }
  }, [fullDataAboutMoLink, param.prm_id]);

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
      if (scrollTop + clientHeight === scrollHeight && searchQuery.length < 2) {
        setNewOffset((prev) => prev + 50);
      }
    },
    [setNewOffset, searchQuery.length],
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
          onClose={() => setSearchQuery('')}
          value={selectedOptions}
          getOptionLabel={(option) => option.name ?? ''}
          filterOptions={(options) => options}
          disabled={!isEdited}
          onChange={(event, newValue) => {
            setSelectedOptions([...newValue]);
            setValue(
              param.tprm_id.toString(),
              newValue.map((option) => option.id),
            );
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'input') setSearchQuery(value);
            if (reason === 'clear') setSearchQuery('');
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          // options={searchQuery.length < 2 ? linkToObjectOptions : linkToObjectSearchOptions}
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
