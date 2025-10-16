import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';
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
import { EditHierarchyLevelFormInputs } from './types';
import { AttributesAutocomplete } from './AttributesAutocomplete';
import { validateName } from '../lib/validateName';
import { IAttributesList } from '../utilities/interface';

const formId = 'edit-hierarchy-level-form';

interface IProps {
  allObjectsAttributes?: string[];
}

export const EditHierarchyLevelDialog: React.FC<IProps> = ({ allObjectsAttributes }) => {
  const { useUpdateLevelMutation } = hierarchyLevels;
  const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;
  const { useGetObjectTypesChildQuery, useGetObjectTypesQuery } = objectTypesApi;

  const { user } = useUser();
  const translate = useTranslate();

  const {
    activeHierarchyMenuItem,
    isEditLevelDialogOpen,
    selectedHierarchyLevel,
    setIsEditLevelDialogOpen,
    setSelectedHierarchyLevel,
  } = useHierarchyBuilder();

  const [paramTypesList, setParamTypesList] = useState<IAttributesList[]>([]);
  const [watchObjectTypeId, setWatchObjectTypeId] = useState<number | null>(null);

  const defaultValues: EditHierarchyLevelFormInputs = useMemo(() => {
    const getKeyAttrs = () => {
      return (
        selectedHierarchyLevel?.data?.key_attrs?.reduce((acc, attr) => {
          const neededAttr = paramTypesList.find((pt) => String(pt?.value) === attr);
          if (neededAttr) {
            acc.push(neededAttr);
            return acc;
          }
          return acc;
        }, [] as IAttributesList[]) ?? []
      );
    };

    return {
      name: selectedHierarchyLevel?.data?.name ?? '',
      object_type_id: selectedHierarchyLevel?.data?.object_type_id || '',
      level: selectedHierarchyLevel?.data?.level ?? 0,
      is_virtual: selectedHierarchyLevel?.data?.is_virtual ?? false,
      author: user?.name ?? selectedHierarchyLevel?.data?.author,
      description: selectedHierarchyLevel?.data?.description ?? '',
      latitude_id: selectedHierarchyLevel?.data?.latitude_id ?? 0,
      longitude_id: selectedHierarchyLevel?.data?.longitude_id ?? 0,
      additional_params_id: selectedHierarchyLevel?.data?.additional_params_id,
      show_without_children: selectedHierarchyLevel?.data?.show_without_children ?? false,
      key_attrs: getKeyAttrs(),
    };
  }, [
    selectedHierarchyLevel?.data?.name,
    selectedHierarchyLevel?.data?.object_type_id,
    selectedHierarchyLevel?.data?.level,
    selectedHierarchyLevel?.data?.is_virtual,
    selectedHierarchyLevel?.data?.author,
    selectedHierarchyLevel?.data?.description,
    selectedHierarchyLevel?.data?.latitude_id,
    selectedHierarchyLevel?.data?.longitude_id,
    selectedHierarchyLevel?.data?.additional_params_id,
    selectedHierarchyLevel?.data?.show_without_children,
    selectedHierarchyLevel?.data?.key_attrs,
    user?.name,
    paramTypesList,
  ]);

  const {
    reset,
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditHierarchyLevelFormInputs>({
    values: defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (selectedHierarchyLevel?.data?.object_type_id) {
      setWatchObjectTypeId(selectedHierarchyLevel?.data?.object_type_id);
    }
  }, [selectedHierarchyLevel?.data?.object_type_id]);

  const [updateLevel, { isLoading: isUpdateLevelLoading }] = useUpdateLevelMutation();

  const closeDialog = () => {
    setIsEditLevelDialogOpen(false);
    setSelectedHierarchyLevel(null);
  };

  const onSubmit: SubmitHandler<EditHierarchyLevelFormInputs> = async (data) => {
    try {
      if (!activeHierarchyMenuItem || !selectedHierarchyLevel)
        throw new Error('No hierarchy selected');

      if (data.key_attrs?.length === 0) {
        setError('key_attrs', { type: 'required', message: translate('This field is required') });
        return;
      }

      const cleanedName = data.name.trim().replace(/\s{2,}/g, ' ');

      await updateLevel({
        hierarchyId: activeHierarchyMenuItem?.id!,
        levelId: selectedHierarchyLevel?.data?.id,
        body: {
          ...data,
          name: cleanedName,
          object_type_id: data.object_type_id as number,
          latitude_id: data.latitude_id || undefined,
          longitude_id: data.longitude_id || undefined,
          additional_params_id: data.additional_params_id || undefined,
          key_attrs: data.key_attrs?.map((opt) => opt?.value) ?? [],
        },
      }).unwrap();
      closeDialog();
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  const { data: allObjectTypes, isLoading: isAllObjectTypesLoading } = useGetObjectTypesQuery({});

  const { data: availableObjectTypes, isLoading: isAvailableObjectTypesLoading } =
    useGetObjectTypesChildQuery(selectedHierarchyLevel?.parentData?.object_type_id!, {
      skip: !selectedHierarchyLevel?.parentData || selectedHierarchyLevel?.parentData.is_virtual,
    });

  const { data: paramTypes, isFetching: isParamTypesLoading } = useGetObjectTypeParamTypesQuery(
    { id: watchObjectTypeId as number },
    {
      skip: !watchObjectTypeId,
      refetchOnMountOrArgChange: true,
    },
  );

  const floatParamTypes = useMemo(() => {
    if (watchObjectTypeId == null) return [];
    return paramTypes?.filter((p) => p.val_type === 'float') ?? [];
  }, [paramTypes, watchObjectTypeId]);

  const attributesList = useMemo<IAttributesList[]>(() => {
    const res: IAttributesList[] = [];
    if (paramTypes !== undefined && paramTypes.length > 0) {
      paramTypes?.forEach((pt) => {
        res.push({ label: pt.name, value: String(pt.id) });
      });
    }
    allObjectsAttributes?.forEach((atrr) => {
      res.push({ label: atrr, value: atrr });
    });

    return res;
  }, [paramTypes, allObjectsAttributes]);

  useEffect(() => {
    setParamTypesList(attributesList);
  }, [attributesList]);

  return (
    <Modal
      title={translate('Edit hierarchy level')}
      open={!!isEditLevelDialogOpen}
      minWidth={500}
      onClose={() => {
        closeDialog();
      }}
      actions={
        <LoadingButton
          loading={isUpdateLevelLoading}
          variant="contained"
          type="submit"
          form={formId}
          disabled={isAllObjectTypesLoading || isAvailableObjectTypesLoading || isParamTypesLoading}
        >
          {translate('Save')}
        </LoadingButton>
      }
    >
      <FormContainer component="form" id={formId} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label={`${translate('Name')}*`}
          {...register('name', {
            required: translate('This field is required'),
            validate: (value) => validateName(value, translate),
          })}
          defaultValue={defaultValues.name}
          helperText={errors.name?.message}
          error={!!errors.name}
        />
        <TextField
          label={translate('Description')}
          {...register('description')}
          defaultValue={defaultValues.description}
          helperText={errors.description?.message}
          error={!!errors.description}
          rows={3}
          multiline
          autoFocus
        />
        <TextField
          label={`${translate('Object type')}*`}
          {...register('object_type_id', { required: translate('This field is required') })}
          defaultValue={defaultValues.object_type_id}
          disabled={
            isAvailableObjectTypesLoading || isAllObjectTypesLoading || !availableObjectTypes
          }
          error={!!errors.object_type_id}
          helperText={errors.object_type_id?.message}
          data-testid="hierarchy-level__object-type"
          fullWidth
          select
          onChange={(e) => {
            setWatchObjectTypeId(+e.target.value);
          }}
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
          defaultValue={defaultValues.latitude_id ?? 0}
          disabled={isParamTypesLoading}
          error={!!errors.latitude_id}
          helperText={errors.latitude_id?.message}
          fullWidth
          select
        >
          <MenuItem value={0}>{translate('None')}</MenuItem>
          {floatParamTypes
            .sort((a) => (a.name.includes('Lat') ? -1 : 1))
            .map((paramType) => (
              <MenuItem key={paramType?.id} value={paramType?.id}>
                {paramType?.name}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          label={translate('Longitude')}
          {...register('longitude_id')}
          defaultValue={defaultValues.longitude_id ?? 0}
          error={!!errors.longitude_id}
          helperText={errors.longitude_id?.message}
          disabled={isParamTypesLoading}
          fullWidth
          select
        >
          <MenuItem value={0}>{translate('None')}</MenuItem>
          {floatParamTypes
            .sort((a) => (a.name.includes('Long') ? -1 : 1))
            .map((paramType) => (
              <MenuItem key={paramType?.id} value={paramType?.id}>
                {paramType?.name}
              </MenuItem>
            ))}
        </TextField>
        <AttributesAutocomplete
          control={control}
          defaultValues={defaultValues.key_attrs}
          disabled={isParamTypesLoading}
          attributesList={attributesList}
          isLoading={isParamTypesLoading}
        />
        <TextField
          label={translate('Additional params')}
          {...register('additional_params_id')}
          defaultValue={defaultValues.additional_params_id ?? 0}
          error={!!errors.additional_params_id}
          helperText={errors.additional_params_id?.message}
          disabled={isParamTypesLoading}
          fullWidth
          select
        >
          <MenuItem value={0}>{translate('None')}</MenuItem>
          {watchObjectTypeId && paramTypes !== undefined && paramTypes.length > 0
            ? paramTypes.map((paramType) => (
                <MenuItem key={paramType.id} value={paramType.id}>
                  {paramType.name}
                </MenuItem>
              ))
            : []}
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
