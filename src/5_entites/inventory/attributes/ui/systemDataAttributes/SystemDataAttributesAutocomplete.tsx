import { useEffect, useState } from 'react';
import { useSearchObjectsByNameWithMisspelledWords, type ParentIDOption } from '5_entites';
import { useDebounceValue } from '6_shared';
import { CircularProgress, TextField } from '@mui/material';
import { useGetAttributeOptions } from '../../hooks';
import { AutocompleteWrapper } from '../attributesComponents';
import { SystemDataAutocompleteStyled } from './SystemDataAttributes.styled';

interface IProps {
  attributeOption: ParentIDOption | null;
  setAttributeOption: (value: ParentIDOption | null, attrName?: string) => void;
  label: string;
  pointsConstraintByTmo?: number[];
  tmoParentId?: number | null;
}

export const SystemDataAttributesAutocomplete = ({
  attributeOption,
  setAttributeOption,
  label,
  tmoParentId,
  pointsConstraintByTmo,
}: IProps) => {
  const [inputValue, setInputValue] = useState<string>('  ');
  const [changeReason, setChangeReason] = useState<string | null>(null);
  const [searchParentIDOptions, setSearchParentIDOptions] = useState<ParentIDOption[]>([]);

  const debouncedValue = useDebounceValue(inputValue);

  const { parentABIDOptions, isFetchingObjectsDataByName } = useGetAttributeOptions({
    searchValue: debouncedValue,
    objectTypeIds: pointsConstraintByTmo ?? [],
    skip: changeReason === 'selectOption' || label === 'Parent Name',
  });

  const { objectsByNameWithMisspelledWordsData, isObjectsByNameWithMisspelledWordsFetching } =
    useSearchObjectsByNameWithMisspelledWords({
      searchValue: debouncedValue,
      tmo_id: tmoParentId ?? 0,
      skip: !tmoParentId || label !== 'Parent Name',
    });

  useEffect(() => {
    if (!objectsByNameWithMisspelledWordsData) return;

    const searchOptions = objectsByNameWithMisspelledWordsData.objects.map((item) => ({
      id: item.id,
      name: item.name,
    }));

    setSearchParentIDOptions(searchOptions);
  }, [objectsByNameWithMisspelledWordsData]);

  return (
    <AutocompleteWrapper sx={{ width: '100%' }}>
      <SystemDataAutocompleteStyled
        options={label === 'Parent Name' ? searchParentIDOptions : parentABIDOptions}
        value={attributeOption}
        getOptionLabel={(option) => option.name || ''}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, value, reason) => {
          setChangeReason(reason);
          setAttributeOption(value ? { ...value, optionName: label } : null, label);
        }}
        onInputChange={(_, value, reason) => {
          if (reason === 'input') {
            setInputValue(value.trim());
            if (value.trim() === '') {
              setInputValue('  ');
            }
          }
          if (reason === 'clear') {
            setInputValue(label === 'Parent Name' ? '  ' : '');
          }
        }}
        loading={
          label === 'Parent Name'
            ? isObjectsByNameWithMisspelledWordsFetching
            : isFetchingObjectsDataByName
        }
        renderInput={(params) => (
          <TextField
            label={label}
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {(label === 'Parent Name' && isObjectsByNameWithMisspelledWordsFetching) ||
                  isFetchingObjectsDataByName ? (
                    <CircularProgress color="primary" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </AutocompleteWrapper>
  );
};
