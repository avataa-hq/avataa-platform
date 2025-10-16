import { ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import { Controller, SubmitHandler, UseFormSetValue, useForm } from 'react-hook-form';
import {
  TextField,
  MenuItem,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Typography,
  FormControl,
  FormLabel,
  FormHelperText,
  useTheme,
} from '@mui/material';
import {
  AddRounded,
  CheckBox,
  CheckBoxOutlineBlank,
  CheckCircleOutlineRounded,
  HighlightOffRounded,
  PublishRounded,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import {
  useTranslate,
  FormContainer,
  objectTypesApi,
  keycloakUsersApi,
  remoteDestinationsApi,
  useSettingsObject,
} from '6_shared';
import CreateObjectTypeModal from 'components/contentOfSettings/objects/dialogBoxes/objectTypes/CreateObjectTypeModal';
import { useGetSourceInfo } from '5_entites/dataflowDiagram/api';
import { loadDestinations, loadTypes } from './mockData';

const { useGetObjectTypesQuery } = objectTypesApi;
const { useGetAllDestinationsQuery } = remoteDestinationsApi;

export interface LoadActionFormInputs {
  type: string;
  name: string;
  tmo_id?: number;
  columns?: Record<string, number>;
  // TODO: Implement these fields after backend will be ready
  destination?: string;
  username?: string;
  password?: string;
  db_schema?: string;
  table_name?: string;
  file_name?: string;
  load_type?: string;
  notify?: boolean;
  users_to_notify?: string[];
}

export type LoadActionFormProps = Omit<JSX.IntrinsicElements['form'], 'onSubmit'> & {
  onSubmit?: (data: Required<LoadActionFormInputs>) => void;
  sourceId?: number;
  onCreateNewTprmsClick?: (props: {
    objectTypeId: number;
    paramTypes: { name: string; val_type: string }[];
  }) => void;
};

const defaultValues: LoadActionFormInputs = {
  type: '',
  name: '',
  tmo_id: undefined,
  columns: undefined,
  destination: 'sftp',
  load_type: 'update',
};

export const LoadActionForm = forwardRef(
  (
    { onSubmit: externalOnSubmit, sourceId, onCreateNewTprmsClick, ...props }: LoadActionFormProps,
    ref: ForwardedRef<{ setValue: UseFormSetValue<LoadActionFormInputs> }>,
  ) => {
    const translate = useTranslate();
    const theme = useTheme();
    const { useGetUsersQuery } = keycloakUsersApi;
    const {
      reset,
      watch,
      control,
      register,
      setValue,
      handleSubmit,
      formState: { errors },
    } = useForm<LoadActionFormInputs>({ defaultValues });

    const { setIsCreateObjectModalOpen } = useSettingsObject();

    const { data: objectTypes, isFetching: isObjectTypesFetching } = useGetObjectTypesQuery({});

    const { sourceConfig, isSourceConfigFetching, sourceData, isSourceDataFetching } =
      useGetSourceInfo(sourceId);

    const { data: allUsers, isFetching: isUsersFetching } = useGetUsersQuery();

    const { data: allDestinations, isFetching: isDestinationsFetching } =
      useGetAllDestinationsQuery();

    const onSubmit: SubmitHandler<LoadActionFormInputs> = (data) => {
      externalOnSubmit?.(data as Required<LoadActionFormInputs>);
    };

    useImperativeHandle(ref, () => ({
      setValue,
    }));

    useEffect(() => {
      reset(defaultValues);
    }, [reset]);

    const watchObjectTypeId = watch('tmo_id');
    const watchDestination = watch('type');

    const handleLoadObjectsClick = useCallback(() => {
      if (!watchObjectTypeId || !sourceConfig || !sourceData) return;

      onCreateNewTprmsClick?.({
        objectTypeId: watchObjectTypeId,
        paramTypes: sourceConfig.map(({ id, ...configWithoutId }) => configWithoutId),
      });
    }, [watchObjectTypeId, sourceConfig, sourceData, onCreateNewTprmsClick]);

    return (
      <>
        <form style={{ display: 'flex' }} {...props} onSubmit={handleSubmit(onSubmit)}>
          <FormContainer sx={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
            {/* <TextField
              label={`${translate('Name')}*`}
              {...register('name', { required: translate('This field is required') })}
              error={!!errors.name}
              helperText={errors.name?.message}
            /> */}
            <TextField
              label={`${translate('Type')}*`}
              {...register('type', { required: translate('This field is required') })}
              error={!!errors.destination}
              helperText={errors.destination?.message}
              disabled={isObjectTypesFetching}
              defaultValue={defaultValues.destination}
              select
            >
              <MenuItem value="" sx={{ display: 'none' }} />
              {loadDestinations?.map((destination) => (
                <MenuItem key={destination.id} value={destination.id}>
                  {destination.name}
                </MenuItem>
              ))}
            </TextField>
            {watchDestination === 'inventory' && (
              <>
                <TextField
                  label={`${translate('Name')}*`}
                  {...register('name', { required: translate('This field is required') })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <Box component="div" display="flex" alignItems="end" gap="5px">
                  <TextField
                    sx={{ flex: 1 }}
                    label={`${translate('Object Type')}*`}
                    {...register('tmo_id', { required: translate('This field is required') })}
                    error={!!errors.tmo_id}
                    helperText={errors.tmo_id?.message}
                    disabled={isObjectTypesFetching}
                    select
                  >
                    <MenuItem value="" sx={{ display: 'none' }} />
                    {objectTypes?.map((objectType) => (
                      <MenuItem key={objectType.id} value={objectType.id}>
                        {objectType.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button variant="contained.icon" onClick={() => setIsCreateObjectModalOpen(true)}>
                    <AddRounded />
                  </Button>
                </Box>
                <FormControl error={!!errors.columns}>
                  {(() => {
                    register('columns', { required: translate('This field is required') });
                    return null;
                  })()}
                  <FormLabel
                    htmlFor="dataview-tprm-creation"
                    sx={{
                      maxWidth: 'fit-content',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      color: 'inherit',
                    }}
                  >
                    <LoadingButton
                      id="dataview-tprm-creation"
                      loading={isSourceConfigFetching || isSourceDataFetching}
                      disabled={!watchObjectTypeId || !sourceConfig || !sourceData}
                      variant="outlined.icon"
                      sx={{ alignSelf: 'start' }}
                      onClick={handleLoadObjectsClick}
                    >
                      <PublishRounded /> {` ${translate("Update Object Type's parameter types")}`}
                    </LoadingButton>
                    {watch('columns') ? (
                      <CheckCircleOutlineRounded color="success" />
                    ) : (
                      <HighlightOffRounded color="error" />
                    )}
                  </FormLabel>
                  <FormHelperText>{errors.columns?.message?.toString()}</FormHelperText>
                </FormControl>
              </>
            )}
            {watchDestination === 'db' && (
              <>
                <TextField
                  label={`${translate('User')}*`}
                  {...register('username', { required: translate('This field is required') })}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
                <TextField
                  label={`${translate('Password')}*`}
                  {...register('password', { required: translate('This field is required') })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <TextField
                  sx={{ flex: 1 }}
                  label={`${translate('Schema')}*`}
                  {...register('db_schema', { required: translate('This field is required') })}
                  error={!!errors.db_schema}
                  helperText={errors.db_schema?.message}
                  disabled={isObjectTypesFetching}
                  select
                >
                  <MenuItem value="">None</MenuItem>
                </TextField>
                <TextField
                  label={`${translate('Table name')}*`}
                  {...register('table_name', { required: translate('This field is required') })}
                  error={!!errors.table_name}
                  helperText={errors.table_name?.message}
                />
              </>
            )}
            {watchDestination === 'sftp' && (
              <Controller
                name="users_to_notify"
                control={control}
                render={({ field: { ref: inputRef, onChange, ...field } }) => (
                  <Autocomplete
                    sx={{ flex: 1 }}
                    disabled={isDestinationsFetching}
                    options={allDestinations?.map((u: any) => u.username) ?? []}
                    onChange={(_, data) => onChange(data)}
                    renderInput={({ InputLabelProps, ...params }) => (
                      <TextField
                        {...params}
                        {...field}
                        inputRef={inputRef}
                        label={translate('Destination')}
                        placeholder={translate('Destination')}
                        error={!!errors.users_to_notify}
                        helperText={errors.users_to_notify?.message}
                      />
                    )}
                  />
                )}
              />
              // <>
              //   <TextField
              //     label={`${translate('User')}*`}
              //     {...register('username', { required: translate('This field is required') })}
              //     error={!!errors.username}
              //     helperText={errors.username?.message}
              //   />
              //   <TextField
              //     label={`${translate('Password')}*`}
              //     {...register('password', { required: translate('This field is required') })}
              //     error={!!errors.password}
              //     helperText={errors.password?.message}
              //   />
              //   <TextField
              //     label={`${translate('File name')}*`}
              //     {...register('file_name', { required: translate('This field is required') })}
              //     error={!!errors.file_name}
              //     helperText={errors.file_name?.message}
              //   />
              // </>
            )}
            <TextField
              sx={{ flex: 1 }}
              label={`${translate('Load type')}*`}
              {...register('load_type', { required: translate('This field is required') })}
              error={!!errors.load_type}
              helperText={errors.load_type?.message}
              defaultValue={defaultValues.load_type}
              select
            >
              <MenuItem value="" sx={{ display: 'none' }} />
              {loadTypes?.map((loadType) => (
                <MenuItem key={loadType.id} value={loadType.id}>
                  {loadType.name}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              sx={{ alignSelf: 'start' }}
              control={
                <Controller
                  name="notify"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label={translate('Notify')}
            />
            {watch('notify') && (
              <Controller
                name="users_to_notify"
                control={control}
                render={({ field: { ref: inputRef, onChange, ...field } }) => (
                  <Autocomplete
                    multiple
                    sx={{ flex: 1 }}
                    disableCloseOnSelect
                    disabled={isUsersFetching}
                    options={allUsers?.map((u) => u.username) ?? []}
                    onChange={(_, data) => onChange(data)}
                    renderOption={(autocompleteProps, option, { selected }) => (
                      <li {...autocompleteProps}>
                        <Checkbox
                          icon={<CheckBoxOutlineBlank fontSize="small" />}
                          checkedIcon={<CheckBox />}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option}
                      </li>
                    )}
                    renderInput={({ InputLabelProps, ...params }) => (
                      <TextField
                        {...params}
                        {...field}
                        inputRef={inputRef}
                        label={
                          <span style={{ display: 'flex', gap: '5px' }}>
                            {translate('Users')}
                            <Typography sx={{ color: theme.palette.text.disabled }}>
                              ({translate('leave empty to select all')})
                            </Typography>
                          </span>
                        }
                        placeholder={translate('Users')}
                        error={!!errors.users_to_notify}
                        helperText={errors.users_to_notify?.message}
                      />
                    )}
                  />
                )}
              />
            )}
          </FormContainer>
        </form>
        <CreateObjectTypeModal />
      </>
    );
  },
);
