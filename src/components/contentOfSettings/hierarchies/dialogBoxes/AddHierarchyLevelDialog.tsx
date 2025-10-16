import { useCallback, useMemo, useEffect } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { FormControlLabel, MenuItem, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import {
  FormContainer,
  Modal,
  useTranslate,
  hierarchyLevels,
  parameterTypesApi,
  objectTypesApi,
  getErrorMessage,
  useHierarchyBuilder,
  useUser,
} from '6_shared';
import type { AddHierarchyLevelFormInputs } from './types';
import { AttributesAutocomplete } from './AttributesAutocomplete';
import { validateName } from '../lib/validateName';
import { IAttributesList } from '../utilities/interface';

const { useAddLevelMutation } = hierarchyLevels;
const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;
const { useGetObjectTypesChildQuery, useGetObjectTypesQuery } = objectTypesApi;

const formId = 'add-hierarchy-level-form';

interface IProps {
  allObjectsAttributes?: string[];
}

export const AddHierarchyLevelDialog = ({ allObjectsAttributes }: IProps) => {
  const translate = useTranslate();

  const { user } = useUser();

  const {
    activeHierarchyMenuItem,
    selectedHierarchyLevel,
    isAddLevelDialogOpen,
    setIsAddLevelDialogOpen,
    setSelectedHierarchyLevel,
  } = useHierarchyBuilder();

  const defaultValues = useMemo(
    () => ({
      name: undefined,
      object_type_id: undefined,
      is_virtual: false,
      latitude_id: undefined,
      longitude_id: undefined,
      additional_params_id: undefined,
      level: selectedHierarchyLevel?.parentData ? selectedHierarchyLevel.parentData.level + 1 : 1,
      parent_id: selectedHierarchyLevel?.parentData?.id ?? undefined,
      author: user?.name ?? '',
      show_without_children: true,
      key_attrs: [],
    }),
    [selectedHierarchyLevel?.parentData, user?.name],
  );

  const {
    watch,
    reset,
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<AddHierarchyLevelFormInputs>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const watchObjectTypeId = watch('object_type_id');

  const [addLevel, { isLoading: isAddLevelLoading }] = useAddLevelMutation();

  const closeDialog = useCallback(() => {
    setIsAddLevelDialogOpen(false);
    setSelectedHierarchyLevel(null);
  }, []);

  const onSubmit: SubmitHandler<AddHierarchyLevelFormInputs> = async ({
    latitude_id,
    longitude_id,
    additional_params_id,
    description,
    key_attrs,
    ...data
  }) => {
    try {
      if (!activeHierarchyMenuItem) throw new Error('No active hierarchy menu item');

      const cleanedName = data.name.trim().replace(/\s{2,}/g, ' ');

      // @ts-ignore
      const keyAttrsIds = key_attrs.map((item) => item.value);

      await addLevel({
        hierarchyId: activeHierarchyMenuItem?.id!,
        body: {
          ...data,
          key_attrs: keyAttrsIds as string[],
          name: cleanedName,

          ...(latitude_id && { latitude_id }),
          ...(longitude_id && { longitude_id }),
          ...(additional_params_id && { additional_params_id }),
        },
      }).unwrap();
      closeDialog();
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  const { data: availableObjectTypes, isLoading: isAvailableObjectTypesLoading } =
    useGetObjectTypesChildQuery(selectedHierarchyLevel?.parentData?.object_type_id!, {
      skip: !selectedHierarchyLevel?.parentData || selectedHierarchyLevel?.parentData?.is_virtual,
    });

  const { data: allObjectTypes, isLoading: isAllObjectTypesLoading } = useGetObjectTypesQuery({});

  const { data: paramTypes, isLoading: isParamTypesLoading } = useGetObjectTypeParamTypesQuery(
    { id: watchObjectTypeId },
    {
      skip: watchObjectTypeId === 0 || !watchObjectTypeId,
      refetchOnMountOrArgChange: true,
    },
  );

  const attributesList = useMemo<IAttributesList[]>(() => {
    const res: IAttributesList[] = [];
    if (paramTypes !== undefined && paramTypes.length > 0) {
      paramTypes.forEach((pt) => {
        res.push({ label: pt.name, value: String(pt.id) });
      });
    }
    allObjectsAttributes?.forEach((atrr) => {
      res.push({ label: atrr, value: atrr });
    });

    return res;
  }, [paramTypes, allObjectsAttributes]);

  return (
    <Modal
      open={!!isAddLevelDialogOpen}
      title={translate('New hierarchy level')}
      minWidth={500}
      onClose={() => {
        closeDialog();
      }}
      actions={
        <LoadingButton
          loading={isAddLevelLoading}
          variant="contained"
          type="submit"
          form={formId}
          disabled={isAllObjectTypesLoading || isAvailableObjectTypesLoading || isParamTypesLoading}
        >
          {translate('Save')}
        </LoadingButton>
      }
    >
      <FormContainer component="form" onSubmit={handleSubmit(onSubmit)} id={formId}>
        <TextField
          label={`${translate('Name')}*`}
          {...register('name', {
            required: translate('This field is required'),
            validate: (value) => validateName(value, translate),
          })}
          helperText={errors.name?.message}
          error={!!errors.name}
        />
        <TextField
          label={translate('Description')}
          {...register('description')}
          helperText={errors.description?.message}
          error={!!errors.description}
          rows={3}
          multiline
          autoFocus
        />
        <TextField
          label={`${translate('Object type')}*`}
          {...register('object_type_id', { required: translate('This field is required') })}
          disabled={isAvailableObjectTypesLoading || isAllObjectTypesLoading}
          error={!!errors.object_type_id}
          helperText={errors.object_type_id?.message}
          data-testid="hierarchy-level__object-type"
          fullWidth
          select
          InputProps={{
            inputProps: {
              'data-testid': 'inner-element-test-id',
            },
          }}
        >
          {selectedHierarchyLevel?.parentData &&
            !selectedHierarchyLevel?.parentData?.is_virtual &&
            availableObjectTypes?.map((objectType) => (
              <MenuItem key={objectType.id} value={objectType.id}>
                {objectType.name}
              </MenuItem>
            ))}
          {(selectedHierarchyLevel?.parentData?.is_virtual ||
            !selectedHierarchyLevel?.parentData) &&
            allObjectTypes?.map((objectType) => (
              <MenuItem key={objectType.id} value={objectType.id}>
                {objectType.name}
              </MenuItem>
            ))}
        </TextField>
        <FormControlLabel
          control={
            <Controller
              name="is_virtual"
              control={control}
              render={({ field: props }) => (
                <Checkbox
                  {...props}
                  checked={props.value}
                  onChange={(e) => props.onChange(e.target.checked)}
                />
              )}
            />
          }
          label={translate('Is virtual')}
        />
        <TextField
          label={translate('Latitude')}
          {...register('latitude_id')}
          helperText={errors.latitude_id?.message}
          error={!!errors.latitude_id}
          disabled={isParamTypesLoading}
          defaultValue={0}
          fullWidth
          select
        >
          <MenuItem value={0}>{translate('None')}</MenuItem>
          {watchObjectTypeId !== 0 &&
            paramTypes &&
            [...paramTypes.filter((p) => p.val_type === 'float')]
              .sort((a) => (a.name.includes('Lat') ? -1 : 1))
              .map((paramType) => (
                <MenuItem key={paramType.id} value={paramType.id}>
                  {paramType.name}
                </MenuItem>
              ))}
        </TextField>
        <TextField
          label={translate('Longitude')}
          {...register('longitude_id')}
          helperText={errors.longitude_id?.message}
          error={!!errors.longitude_id}
          disabled={isParamTypesLoading}
          defaultValue={0}
          fullWidth
          select
        >
          <MenuItem value={0}>{translate('None')}</MenuItem>
          {watchObjectTypeId !== 0 &&
            paramTypes &&
            [...paramTypes.filter((p) => p.val_type === 'float')]
              .sort((a) => (a.name.includes('Long') ? -1 : 1))
              .map((paramType) => (
                <MenuItem key={paramType.id} value={paramType.id}>
                  {paramType.name}
                </MenuItem>
              ))}
        </TextField>
        <AttributesAutocomplete
          control={control}
          attributesList={attributesList}
          defaultValues={[]}
          disabled={isParamTypesLoading}
        />
        <TextField
          label={translate('Additional params')}
          {...register('additional_params_id')}
          error={!!errors.additional_params_id}
          helperText={errors.additional_params_id?.message}
          disabled={isParamTypesLoading}
          defaultValue={0}
          fullWidth
          select
        >
          <MenuItem value={0}>{translate('None')}</MenuItem>
          {watchObjectTypeId !== 0 &&
            paramTypes
              ?.filter((p) => {
                const keyAttrs = watch('key_attrs', getValues('key_attrs')) as string[] | undefined;

                return !keyAttrs?.includes(String(p.id));
              })
              .map((paramType) => (
                <MenuItem key={paramType.id} value={paramType.id}>
                  {paramType.name}
                </MenuItem>
              ))}
        </TextField>
        <FormControlLabel
          control={
            <Controller
              name="show_without_children"
              control={control}
              render={({ field: props }) => (
                <Checkbox
                  {...props}
                  checked={props.value}
                  onChange={(e) => props.onChange(e.target.checked)}
                />
              )}
            />
          }
          label={translate('Show without children')}
        />
      </FormContainer>
    </Modal>
  );
};
