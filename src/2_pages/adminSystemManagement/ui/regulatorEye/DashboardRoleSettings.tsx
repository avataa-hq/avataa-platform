import { SyntheticEvent } from 'react';
import { Autocomplete, CircularProgress, Divider, Paper, TextField } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { Controller, ControllerRenderProps, FieldValues, UseFormReturn } from 'react-hook-form';

import { EditModuleDataType } from '2_pages/adminSystemManagement/model';
import { DarkDisabledTextField, keycloakRolesApi, LoadingContainer, useTranslate } from '6_shared';

export const DashboardRoleSettings = ({
  groupName,
  strings,
  defaultModuleName,
  form,
  editModuleData,
}: {
  groupName: string;
  strings: Record<string, string>;
  defaultModuleName: string;
  form: UseFormReturn<FieldValues, any, undefined>;
  editModuleData: ({ defaultModuleName, groupName, key, newValue }: EditModuleDataType) => void;
}) => {
  const { useGetRolesQuery } = keycloakRolesApi;
  const translate = useTranslate();
  const { data: roles, isFetching: isRolesFetching } = useGetRolesQuery();

  const {
    control,
    formState: { errors },
  } = form;

  const handleInputChange = (key: string, newValue: string) => {
    editModuleData({ defaultModuleName, groupName, key, newValue });
  };

  const onFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, `${string}/${string}/${string}`>,
  ) => {
    field.onChange(e);
  };

  return (
    <Paper sx={{ padding: '1rem' }}>
      <Box component="div">{translate(groupName as any)}</Box>
      <Divider />
      {isRolesFetching && (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      )}
      {roles &&
        Object.entries(strings).map(([key, value]) => (
          <Stack
            direction="row"
            divider={
              <Divider orientation="vertical" sx={{ paddingBottom: '5px' }} flexItem>
                :
              </Divider>
            }
            style={{ display: 'flex', alignItems: 'center' }}
            key={key}
          >
            <DarkDisabledTextField
              InputProps={{
                disableUnderline: true,
              }}
              variant="standard"
              value={key}
              fullWidth
              size="small"
              disabled
            />
            <Controller
              control={control}
              name={`${defaultModuleName}/${groupName}/${key}`}
              defaultValue={value ?? ''}
              render={({ field, fieldState: { error } }) => {
                return (
                  <Autocomplete
                    options={roles.map((role) => role.name)}
                    getOptionLabel={(option) => option}
                    autoComplete
                    fullWidth
                    includeInputInList
                    value={field.value}
                    onChange={(e: SyntheticEvent<Element, Event>, selectedOption) => {
                      if (selectedOption) {
                        handleInputChange(key, selectedOption);
                        onFieldChange(selectedOption as any, field);
                      }
                    }}
                    renderInput={(params) => <TextField {...params} variant="standard" />}
                  />
                );
              }}
            />
          </Stack>
        ))}
    </Paper>
  );
};
