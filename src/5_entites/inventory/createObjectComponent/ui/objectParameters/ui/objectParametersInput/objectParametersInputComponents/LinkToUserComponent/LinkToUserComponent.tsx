import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress, useTheme } from '@mui/material';
import { IObjectComponentParams, keycloakUsersApi, useDebounceValue, useTranslate } from '6_shared';
import { AutocompleteWrapper, ErrorMessage, Label, Wrapper } from '../../commonComponents';

interface IProps {
  param: IObjectComponentParams;
}

interface ILinkToUserOption {
  id: string | number;
  username: string;
}

export const LinkToUserComponent = ({ param }: IProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  const { useGetUsersQuery } = keycloakUsersApi;
  const {
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const [newOffset, setNewOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [linkToUserOptions, setLinkToUserOptions] = useState<ILinkToUserOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ILinkToUserOption | null>(null);

  const debouncedSearchQuery = useDebounceValue(searchQuery);

  const { data: allUsers, isFetching: isUsersFetching } = useGetUsersQuery({
    first: newOffset,
    search: debouncedSearchQuery,
  });

  /**
   * An effect that processes fetched data and updates component states.
   * Update the totalObjects state with the total count from fetched data
   * const newOptions => Initialize an array to hold new options
   * If `selectedOption` is not defined and matches the current item, set it
   * Update the linkToUserOptions state with new options
   */
  useEffect(() => {
    if (allUsers) {
      const newOptions = allUsers.map((item) => {
        const userName =
          item.firstName && item.lastName
            ? `${item.firstName} ${item.lastName}`
            : item.username ?? '';

        const option = { id: item.id ?? 0, username: userName };

        if (!selectedOption && (getValues(param.id.toString()) ?? param.value) === userName) {
          setSelectedOption(option);
        }

        return option;
      });

      setLinkToUserOptions((prev) => {
        const updatedOptions = [...prev];
        newOptions.forEach((newOption) => {
          if (!prev.some((option) => option.id === newOption.id)) {
            updatedOptions.push(newOption);
          }
        });
        return updatedOptions;
      });
    }
  }, [getValues, allUsers, param, selectedOption]);

  /**
   * An effect that updates the form value when selected options change.
   * Check if `selectedOption` is defined
   * Compare the current form value with `selectedOption.name`
   * Update the form value with the selected option's ID
   */
  useEffect(() => {
    if (!selectedOption) return;
    if (getValues(param.id.toString()) !== selectedOption.username) {
      setValue(param.id.toString(), selectedOption.username);
    }
  }, [getValues, param.id, selectedOption, setValue]);

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
   * identified by its id, is included in the linkToUserOptions state array.
   * If the selected option does not already exist in linkToUserOptions, it will be added to the array.
   */
  useEffect(() => {
    if (linkToUserOptions.length !== 0 && selectedOption !== null) {
      const currentOption = linkToUserOptions.find((item) => item.id === selectedOption.id);
      if (!currentOption) {
        const newLinkToUserOptions = [...linkToUserOptions, selectedOption];
        setLinkToUserOptions(newLinkToUserOptions);
      }
    }
  }, [linkToUserOptions, selectedOption]);

  return (
    <Wrapper sx={{ position: 'relative' }}>
      <Label>{param.name}</Label>
      <AutocompleteWrapper sx={{ width: '60%' }}>
        <Autocomplete
          disablePortal
          filterSelectedOptions
          value={selectedOption}
          getOptionLabel={(option) => option.username ?? ''}
          onChange={(event, newValue) => {
            setSelectedOption(newValue);
            clearErrors(param.id.toString());
          }}
          onInputChange={(_, value, reason) => {
            if (reason === 'input') setSearchQuery(value);
          }}
          isOptionEqualToValue={(option, value) => option.username === value.username}
          options={linkToUserOptions}
          loading={isUsersFetching}
          ListboxProps={{ onScroll: handleScroll }}
          renderInput={(params) => (
            <TextField
              variant="outlined"
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isUsersFetching ? <CircularProgress color="primary" size={20} /> : null}
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
