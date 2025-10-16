import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, TextField, CircularProgress, useTheme } from '@mui/material';
import { AutocompleteWrapper, DeleteButton, IParams } from '5_entites';
import { keycloakUsersApi, useDebounceValue } from '6_shared';

interface IProps {
  param: IParams;
  isEdited?: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
  customWrapperStyles?: React.CSSProperties;
  testid?: string;
}

interface ILinkToUserOption {
  id: number | string;
  username: string;
}

export const LinkToUserComponent = ({
  param,
  isEdited,
  onDeleteClick,
  showDeleteButton = true,
  endButtonSlot,
  customWrapperStyles,
  testid,
}: IProps) => {
  const theme = useTheme();
  const { setValue } = useFormContext();
  const { useGetUsersQuery } = keycloakUsersApi;
  const [linkToUserOptions, setLinkToUserOptions] = useState<ILinkToUserOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ILinkToUserOption | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newOffset, setNewOffset] = useState(0);
  const [totalObjects, setTotalObjects] = useState<number | null>(null);

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
        const option = {
          id: item.id ?? 0,
          username: userName,
        };

        if (param.value === userName) {
          setSelectedOption(option);
        }

        // if (!selectedOption && param.value === item.username) {
        //   setSelectedOption(option);
        // }

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
  }, [allUsers, param]);

  /**
   * An effect that updates the form value when selected options change.
   * Check if `selectedOption` is defined
   * Compare the current form value with `selectedOption.name`
   * Update the form value with the selected option's ID
   */
  useEffect(() => {
    if (!selectedOption) return;
    if (param.value !== selectedOption.username) {
      setValue(param.tprm_id.toString(), selectedOption.username);
    }
  }, [param.tprm_id, param.value, selectedOption, setValue]);

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
        paddingRight: showDeleteButton || endButtonSlot ? 0 : '40px',
      }}
      style={{ ...customWrapperStyles }}
    >
      <Autocomplete
        filterSelectedOptions
        disabled={!isEdited}
        value={selectedOption}
        getOptionLabel={(option) => option.username ?? ''}
        onChange={(event, newValue) => {
          setSelectedOption(newValue);
        }}
        onInputChange={(_, value, reason) => {
          if (reason === 'input') setSearchQuery(value);
          if (reason === 'clear') {
            setSearchQuery('');
            setSelectedOption(null);
            setValue(param.tprm_id.toString(), 'Unassigned');
          }
        }}
        isOptionEqualToValue={(option, value) => option.username === value.username}
        options={linkToUserOptions}
        loading={isUsersFetching}
        ListboxProps={{
          onScroll:
            (totalObjects !== null && totalObjects >= 50) ||
            linkToUserOptions.length === totalObjects
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
          width: '100%',
        }}
      />
      {showDeleteButton && <DeleteButton onClick={() => onDeleteClick?.(param.tprm_id)} />}
      {endButtonSlot}
    </AutocompleteWrapper>
  );
};
