import { useCallback, useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, Divider, LinearProgress, TextField } from '@mui/material';
import {
  ISecondaryActionSlotProps,
  ObjectTemplatesList,
  useBuildTemplateParamsFormData,
  useCreateObjectsFromTemplate,
  useGetObjectTypes,
  useGetTemplatesByFilter,
  useGetTemplatesDepth,
  useLazyGetTemplateObjects,
} from '5_entites';
import {
  ActionTypes,
  ConfirmActionModal,
  InventoryObjectTypesModel,
  IObjectTemplateModel,
  useHierarchy,
  useTranslate,
} from '6_shared';
import { FormProvider, useForm } from 'react-hook-form';
import { enqueueSnackbar, closeSnackbar } from 'notistack';
import { Header, TemplatesComponentStyled } from './TemplatesComponent.styled';
import { ObjectTemplatesListActions } from './objectTemplatesListActions/ObjectTemplatesListActions';

interface IProps {
  activePage: string;
  permissions?: Record<ActionTypes, boolean>;
}

export const TemplatesComponent = ({ activePage, permissions }: IProps) => {
  const translate = useTranslate();
  const form = useForm();

  const [selectedTemplate, setSelectedTemplate] = useState<IObjectTemplateModel | null>(null);
  const [selectedObjectType, setSelectedObjectType] = useState<InventoryObjectTypesModel | null>(
    null,
  );
  const [buildTemplatesFormDataLoading, setBuildTemplatesFormDataLoading] = useState(false);
  const [isConfirmCreateObjectsModalOpen, setIsConfirmCreateObjectsModalOpen] = useState(false);

  const { selectedObjectTypeItem } = useHierarchy();

  const { objectTypesData, isFetching: isFetchingObjectTypes } = useGetObjectTypes({});

  const { buildTemplateParamsFormData } = useBuildTemplateParamsFormData();

  const {
    runCreationObjectsFromTemplate,
    isCreateObjectModalOpen,
    setIsCreateObjectModalOpen,
    withRequiredParamsStack,
    setWithRequiredParamsStack,
  } = useCreateObjectsFromTemplate();

  const { templateDepth } = useGetTemplatesDepth({
    tmoId: selectedObjectType?.id || 0,
    skip: !selectedObjectType,
  });

  const { getTemplateObjectsFn } = useLazyGetTemplateObjects();

  const { data: templatesData, isFetching: isTemplatesFetching } = useGetTemplatesByFilter({
    objectTypeId: selectedObjectType?.id || 0,
    skip: !selectedObjectType,
  });

  const objectTypesList = useMemo(() => {
    return activePage === 'processManager'
      ? objectTypesData?.filter((item) => item.lifecycle_process_definition)
      : objectTypesData;
  }, [activePage, objectTypesData]);

  useEffect(() => {
    if (buildTemplatesFormDataLoading && isCreateObjectModalOpen) {
      enqueueSnackbar(
        <div style={{ width: '200px' }}>
          Creating objects...
          <LinearProgress />
        </div>,
        { variant: 'info', persist: true, key: 'buildTemplatesFormDataLoading' },
      );
    }
    if (!buildTemplatesFormDataLoading) {
      closeSnackbar('buildTemplatesFormDataLoading');
      setIsCreateObjectModalOpen(false);
    }
  }, [buildTemplatesFormDataLoading, isCreateObjectModalOpen, setIsCreateObjectModalOpen]);

  useEffect(() => {
    if (withRequiredParamsStack > 0) {
      enqueueSnackbar(`Creating objects with required params, ${withRequiredParamsStack} left`, {
        variant: 'info',
      });
    }
  }, [withRequiredParamsStack]);

  useEffect(() => {
    setSelectedObjectType(selectedObjectTypeItem);
  }, [selectedObjectTypeItem]);

  const onTemplateClick = async (template: IObjectTemplateModel) => {
    if (!selectedObjectType || !template.valid) return;
    setSelectedTemplate(template);
    setIsConfirmCreateObjectsModalOpen(true);
  };

  const onConfirmCreateObjects = async () => {
    if (!selectedTemplate) return;
    setIsConfirmCreateObjectsModalOpen(false);

    setBuildTemplatesFormDataLoading(true);

    const templateObjects = await getTemplateObjectsFn({
      template_id: selectedTemplate.id,
      depth: templateDepth,
      include_parameters: true,
    });

    const { templateParamsTree, withRequiredParamsLength } = await buildTemplateParamsFormData(
      templateObjects,
    );

    setWithRequiredParamsStack(withRequiredParamsLength);
    await runCreationObjectsFromTemplate(templateParamsTree);
    setBuildTemplatesFormDataLoading(false);
  };

  const secondaryActionSlot = useCallback(
    (slotProps: ISecondaryActionSlotProps) => (
      <ObjectTemplatesListActions
        {...slotProps}
        selectedTemplateId={selectedTemplate?.id}
        showEditButton={false}
        showDeleteButton={false}
        buildTemplatesFormDataLoading={buildTemplatesFormDataLoading}
        permissions={permissions}
      />
    ),
    [buildTemplatesFormDataLoading, permissions, selectedTemplate],
  );

  return (
    <FormProvider {...form}>
      <TemplatesComponentStyled>
        <Header>
          <Autocomplete
            fullWidth
            value={selectedObjectType}
            options={objectTypesList || []}
            onChange={(event, newValue) => {
              setSelectedObjectType(newValue);
            }}
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                InputProps={{
                  ...inputParams.InputProps,
                  endAdornment: (
                    <>
                      {isFetchingObjectTypes ? (
                        <CircularProgress color="primary" size={20} />
                      ) : null}
                      {inputParams.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            loading={isFetchingObjectTypes}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterSelectedOptions
          />
        </Header>

        <Divider />

        <ObjectTemplatesList
          selectedTemplateId={selectedTemplate?.id}
          templatesData={templatesData}
          isLoading={isTemplatesFetching}
          onTemplateClick={onTemplateClick}
          secondaryActionSlot={(slotProps) => secondaryActionSlot(slotProps)}
          permissions={permissions}
        />

        <ConfirmActionModal
          isOpen={isConfirmCreateObjectsModalOpen}
          onClose={() => setIsConfirmCreateObjectsModalOpen(false)}
          onConfirmActionClick={onConfirmCreateObjects}
          confirmationButtonText={translate('Create')}
          title="Are you sure you want to create objects from this template?"
        />
      </TemplatesComponentStyled>
    </FormProvider>
  );
};
