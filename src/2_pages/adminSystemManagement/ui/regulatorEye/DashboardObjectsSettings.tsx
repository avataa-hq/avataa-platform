import { SyntheticEvent } from 'react';
import { Autocomplete, CircularProgress, Divider, Paper, TextField } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { Controller, ControllerRenderProps, FieldValues, UseFormReturn } from 'react-hook-form';
import { EditModuleDataType } from '2_pages/adminSystemManagement/model';
import { DarkDisabledTextField, LoadingContainer, objectTypesApi, useTranslate } from '6_shared';

export const DashboardObjectsSettings = ({
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
  const { useGetObjectTypesQuery } = objectTypesApi;
  const translate = useTranslate();

  const { data: objectTypes, isFetching: isObjectTypesFetching } = useGetObjectTypesQuery();

  const { control } = form;

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
      {isObjectTypesFetching && (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      )}
      {objectTypes &&
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
              render={({ field }) => {
                return (
                  <Autocomplete
                    options={objectTypes.map((ot) => ot.id)}
                    getOptionLabel={(option) =>
                      objectTypes?.find((ot) => ot.id === option)?.name ?? option
                    }
                    autoComplete
                    fullWidth
                    includeInputInList
                    value={
                      objectTypes?.find((ot) => ot.id === Number(field.value))?.id ?? field.value
                    }
                    onChange={(e: SyntheticEvent<Element, Event>, v) => {
                      const val = objectTypes?.find((ot) => ot.id === v)?.id?.toString();
                      if (val) {
                        handleInputChange(key, val);
                        onFieldChange(val as any, field);
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
