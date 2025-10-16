import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, CircularProgress, TextField, useTheme } from '@mui/material';
import { IObjectComponentParams, keycloakUsersApi, useDebounceValue } from '6_shared';
import { AutocompleteWrapper, Label, Wrapper } from '../../commonComponents';

interface IProps {
  param: IObjectComponentParams;
}

interface ILinkToUserOptions {
  id: number | string;
  username: string;
}

export const LinkToUserMultipleComponent = ({ param }: IProps) => {
  const theme = useTheme();
  const { useGetUsersQuery } = keycloakUsersApi;
  const { setValue, getValues, clearErrors } = useFormContext();
  const [currentParamOptions, setCurrentParamOptions] = useState<ILinkToUserOptions[]>([]);
  const [linkToUserOptions, setLinkToUserOptions] = useState<ILinkToUserOptions[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<ILinkToUserOptions[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newOffset, setNewOffset] = useState(0);

  const debouncedSearchQuery = useDebounceValue(searchQuery);

  const { data: allUsers, isFetching: isUsersFetching } = useGetUsersQuery({
    first: newOffset,
    search: debouncedSearchQuery,
  });

  /**
   * This useEffect is used to handle form validation errors
   * related to a specific parameter (param) based on the selectedOptions state.
   */
  // useEffect(() => {
  //   if (selectedOptions.length === 0) {
  //     setError(param.id.toString(), {
  //       type: 'required',
  //       message: translate('This field is required'),
  //     });
  //   } else {
  //     clearErrors(param.id.toString());
  //   }
  // }, [clearErrors, param, selectedOptions, setError, translate]);

  /**
   * An effect that processes fetched data and updates component states.
   * setTotalObjects => Update the totalObjects state with the total count from fetched data
   * const newSelectedOptions => Initialize a new array to hold selected options
   * objectsByNameData.data.map => Map fetched data to new options, checking if they are already selected
   * Update the linkToUserOptions state with new options
   * If no options are currently selected, set the new selected options
   */
  useEffect(() => {
    if (allUsers) {
      const newSelectedOptions: ILinkToUserOptions[] = [];

      const newOptions = allUsers.map((item) => {
        const userName =
          item.firstName && item.lastName
            ? `${item.firstName} ${item.lastName}`
            : item.username ?? '';

        const option = { id: item.id ?? 0, username: userName };
        const paramValue = getValues(param.id.toString());
        if (paramValue && paramValue.includes(userName))
          newSelectedOptions.push({ id: item.id ?? 0, username: userName });

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

      if (selectedOptions.length === 0 && newSelectedOptions.length !== 0)
        setSelectedOptions(newSelectedOptions);
      if (currentParamOptions.length === 0 && newSelectedOptions.length !== 0)
        setCurrentParamOptions(newSelectedOptions);
    }
  }, [allUsers, param, selectedOptions, currentParamOptions, getValues, linkToUserOptions.length]);

  /**
   * This `useEffect` block is responsible for updating the form value
   * based on selected options in the Autocomplete component.
   */
  useEffect(() => {
    const isEqual =
      currentParamOptions.length === selectedOptions.length &&
      currentParamOptions.every((value) =>
        selectedOptions.some((option) => option.id === value.id),
      );

    if (!isEqual) {
      setValue(
        param.id.toString(),
        selectedOptions.map((option) => option.username),
      );
    }
  }, [currentParamOptions, param, selectedOptions, setValue]);

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
          filterSelectedOptions
          value={selectedOptions}
          getOptionLabel={(option) => option.username ?? ''}
          onChange={(event, newValue) => {
            setSelectedOptions([...newValue]);
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
