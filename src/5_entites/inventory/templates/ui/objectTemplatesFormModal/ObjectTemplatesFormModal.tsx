import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { ParameterComponents } from '5_entites/inventory/ui';
import {
  ICreateObjectTemplateBody,
  useTranslate,
  InventoryParameterTypesModel,
  ActionTypes,
  IObjectTemplateModel,
  InventoryObjectTypesModel,
  LoadingAvataa,
  DraggableDialog,
  InputWithIcon,
  IObjectTemplateObjectModel,
  useDebounceValue,
} from '6_shared';
import {
  useAddTemplateObjects,
  useAddTemplateParameters,
  useCreateTemplate,
  useDeleteTemplateObjectParameter,
  useUpdateTemplateParameters,
} from '5_entites/inventory/api';
import {
  ICreateChildTemplateIds,
  ITemplateParam,
  TEMPLATE_FORM_ID,
  TemplateMode,
} from '../../model';
import { buildRequestObjectTemplateParams, buildRequestTemplateParams } from '../../lib';
import { useTemplateObjectParams } from '../../hooks';

interface IProps {
  objectTypeParamTypes: InventoryParameterTypesModel[] | undefined;
  templateObjectData: IObjectTemplateObjectModel | undefined;
  mode: TemplateMode;
  selectedTemplate: IObjectTemplateModel | null;
  selectedObjectType: InventoryObjectTypesModel | null;
  createChildTemplateIds: ICreateChildTemplateIds | null;
  setCreateChildTemplateIds: (data: ICreateChildTemplateIds | null) => void;
  isTemplateModalOpen: boolean;
  onCloseTemplateModal: () => void;
  isLoading: boolean;
  permissions?: Record<ActionTypes, boolean>;
}

export const ObjectTemplatesFormModal = ({
  objectTypeParamTypes,
  templateObjectData,
  mode,
  selectedTemplate,
  selectedObjectType,
  createChildTemplateIds,
  setCreateChildTemplateIds,
  isTemplateModalOpen,
  onCloseTemplateModal,
  isLoading,
  permissions,
}: IProps) => {
  const translate = useTranslate();

  const { handleSubmit, reset, formState, register } = useFormContext();

  const [searchParamValue, setSearchParamValue] = useState<string>('');

  const debouncedSearchParamValue = useDebounceValue(searchParamValue, 300);

  const { addTemplateParametersFn } = useAddTemplateParameters();
  const { updateTemplateObjectParametersFn } = useUpdateTemplateParameters();
  const { deleteTemplateObjectParameterFn } = useDeleteTemplateObjectParameter();

  const { createTemplateFn } = useCreateTemplate();

  const { addTemplateObjectFn } = useAddTemplateObjects();

  const templateObjectParameters = useMemo(() => {
    return templateObjectData?.parameters;
  }, [templateObjectData]);

  const { params } = useTemplateObjectParams({
    mode,
    objectTypeParamTypes,
    templateObjectParameters,
    searchValue: debouncedSearchParamValue,
  });

  const onFormSubmit = async (data: Record<string, any>) => {
    // Add/update template parameters
    if (selectedTemplate && mode === 'edit') {
      const { paramsToCreate, paramsToUpdate } = buildRequestTemplateParams({
        formData: data,
        templateObjectParameters,
        objectTypeParamTypes,
      });

      if (paramsToUpdate.length !== 0 && templateObjectData) {
        await updateTemplateObjectParametersFn({
          template_object_id: templateObjectData.id,
          parameters: paramsToUpdate,
        });
      }

      if (paramsToCreate.length !== 0 && templateObjectData) {
        await addTemplateParametersFn({
          template_object_id: templateObjectData.id,
          body: paramsToCreate,
        });
      }
    }

    const templateParams = buildRequestObjectTemplateParams({
      formData: data,
      objectTypeParamTypes,
    });

    // Create template
    if (mode !== 'createChild' && data.templateName) {
      const createTemplateBody: ICreateObjectTemplateBody = {
        name: data.templateName.trim(),
        object_type_id: selectedObjectType?.id || 0,
        owner: '',
        template_objects: [
          {
            object_type_id: selectedObjectType?.id || 0,
            required: true,
            parameters: templateParams,
          },
        ],
      };
      await createTemplateFn(createTemplateBody);
    }

    // Create object template
    if (mode === 'createChild' && createChildTemplateIds && templateParams?.length > 0) {
      await addTemplateObjectFn({
        template_id: createChildTemplateIds.template_id,
        parent_id: createChildTemplateIds?.parent_id,
        body: [
          {
            object_type_id: createChildTemplateIds.object_type_id,
            required: true,
            parameters: templateParams,
          },
        ],
      });
    }

    reset();
    onCloseTemplateModal();
    setCreateChildTemplateIds(null);
  };

  const onDeleteTemplateParamClick = async (param: ITemplateParam) => {
    if (!selectedTemplate || !param?.templateParamId) return;
    await deleteTemplateObjectParameterFn(param.templateParamId);
  };

  return (
    <DraggableDialog
      open={isTemplateModalOpen}
      onClose={onCloseTemplateModal}
      width={600}
      height={400}
      title={
        <Box
          component="div"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mr: 2 }}
        >
          <Typography>{translate('Templates')}</Typography>

          <InputWithIcon
            icon={null}
            placeHolderText="Quick parameter search"
            value={searchParamValue}
            onChange={(e) => setSearchParamValue(e.target.value)}
            customStyles={{ backgroundColor: 'inherit' }}
          />
        </Box>
      }
      draggable={false}
      actions={
        <>
          <Button
            disabled={permissions?.update !== true}
            variant="outlined"
            onClick={onCloseTemplateModal}
          >
            {translate('Cancel')}
          </Button>
          <Button
            disabled={permissions?.update !== true}
            type="submit"
            form={TEMPLATE_FORM_ID}
            variant="contained"
          >
            {translate('Save')}
          </Button>
        </>
      }
    >
      <Box component="div" sx={{ width: '100%', height: '100%' }}>
        {isLoading && (
          <Box
            component="div"
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <LoadingAvataa />
          </Box>
        )}
        {!isLoading && (
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            id={TEMPLATE_FORM_ID}
            style={{ height: '100%', overflowY: 'auto' }}
          >
            {mode === 'create' && (
              <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}
              >
                <Typography>{translate('Template name')}</Typography>
                <TextField
                  fullWidth
                  placeholder={translate('Enter template name')}
                  // InputLabelProps={{ shrink: true }}
                  // sx={{ px: 2, mb: 2 }}
                  error={!!formState.errors.templateName}
                  helperText={(formState.errors?.templateName?.message as string) || ''}
                  {...register('templateName', {
                    required: translate('This field is required'),
                    validate: (value) => value.trim() !== '' || translate('This field is required'),
                  })}
                />
              </Box>
            )}

            {params?.length === 0 && (
              <Box
                component="div"
                sx={{
                  height: mode === 'createChild' ? '100%' : '50%',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Typography sx={{ textAlign: 'center' }}>
                  {translate('No parameters found')}
                </Typography>
              </Box>
            )}

            {params.length > 0 && (
              <>
                <Divider />

                <List sx={{ width: '100%' }}>
                  {params.map((param) => (
                    <ListItem
                      key={param.id}
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        width: '100%',
                      }}
                    >
                      <ListItemText>{param.name}</ListItemText>
                      <Box
                        component="div"
                        sx={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <ParameterComponents
                          param={param}
                          showDeleteButton={!!param.value}
                          onDeleteClick={() => onDeleteTemplateParamClick(param)}
                          isEdited
                          customNotMultipleWrapperSx={{ width: '100%' }}
                          customMultipleWrapperSx={{ width: '100%' }}
                          testid={`object-templates-form-modal__${param.name}`}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </form>
        )}
      </Box>
    </DraggableDialog>
  );
};
