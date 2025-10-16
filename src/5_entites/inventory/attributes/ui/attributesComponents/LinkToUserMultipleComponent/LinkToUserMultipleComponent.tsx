import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Autocomplete, CircularProgress, TextField, useTheme } from '@mui/material';
import { AutocompleteWrapper, DeleteButton, IParams } from '5_entites';
import { keycloakUsersApi, useDebounceValue } from '6_shared';
import { UserRepresentation } from '6_shared/api/keycloak/users/types';

interface IProps {
  param: IParams;
  isEdited?: boolean;
  onDeleteClick?: (newParamTypeId: number) => void;
  showDeleteButton?: boolean;
  endButtonSlot?: React.ReactNode;
}

interface ILinkToUserOptions {
  id: number | string;
  username: string;
}

export const LinkToUserMultipleComponent = ({
  param,
  isEdited,
  onDeleteClick,
  showDeleteButton = true,
  endButtonSlot,
}: IProps) => {
  const theme = useTheme();
  const { setValue } = useFormContext();
  const { useGetUsersQuery } = keycloakUsersApi;
  const [currentParamOptions, setCurrentParamOptions] = useState<ILinkToUserOptions[]>([]);
  const [linkToUserOptions, setLinkToUserOptions] = useState<ILinkToUserOptions[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<ILinkToUserOptions[]>([]);
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
   * setTotalObjects => Update the totalObjects state with the total count from fetched data
   * const newSelectedOptions => Initialize a new array to hold selected options
   * objectsByNameData.data.map => Map fetched data to new options, checking if they are already selected
   * Update the linkToUserOptions state with new options
   * If no options are currently selected, set the new selected options
   */
  useEffect(() => {
    if (!allUsers) return;

    const createOption = (item: UserRepresentation) => ({
      id: item.id ?? 0,
      username:
        item.firstName && item.lastName
          ? `${item.firstName} ${item.lastName}`
          : item.username ?? '',
    });

    const newSelectedOptions: ILinkToUserOptions[] = [];

    const newOptions = allUsers.map((item) => {
      const userName =
        item.firstName && item.lastName
          ? `${item.firstName} ${item.lastName}`
          : item.username ?? '';

      const option = createOption(item);
      if (param.value && param.value.includes(userName)) {
        newSelectedOptions.push(option);
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

    if (selectedOptions.length === 0 && newSelectedOptions.length !== 0)
      setSelectedOptions(newSelectedOptions);
    if (currentParamOptions.length === 0 && newSelectedOptions.length !== 0)
      setCurrentParamOptions(newSelectedOptions);
  }, [allUsers, param, selectedOptions, currentParamOptions]);

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
        param.tprm_id.toString(),
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
        disablePortal
        disableCloseOnSelect
        filterSelectedOptions
        disabled={!isEdited}
        value={selectedOptions}
        getOptionLabel={(option) => option.username ?? ''}
        onChange={(event, newValue) => setSelectedOptions([...newValue])}
        onInputChange={(_, value, reason) => {
          if (reason === 'input') setSearchQuery(value);
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
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
          width: '80%',
          flexGrow: 1,
        }}
      />
      {showDeleteButton && <DeleteButton onClick={() => onDeleteClick?.(param.tprm_id)} />}
      {endButtonSlot}
    </AutocompleteWrapper>
  );
};
