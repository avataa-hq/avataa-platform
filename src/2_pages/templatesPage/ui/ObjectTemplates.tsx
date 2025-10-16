import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AddIcon,
  Box,
  ConfirmActionModal,
  Divider,
  IconButton,
  INotValidParamWithObjectType,
  IObjectTemplateModel,
  SidebarLayout,
  useDebounceValue,
  useExportTemplate,
  useGetPermissions,
  useHierarchy,
  useTranslate,
} from '6_shared';
import { useTheme } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { FormProvider, useForm } from 'react-hook-form';
import { CustomSearch } from 'components/_reused components/myInput/CustomSearch';
import {
  ICreateChildTemplateIds,
  ISecondaryActionSlotProps,
  ObjectTemplatesFormModal,
  ObjectTemplatesList,
  ObjectTemplatesNotValidModal,
  ObjectTemplatesNotValidForm,
  TemplateGraph,
  TemplateMode,
  useDeleteTemplate,
  useGetObjectTypeParamTypes,
  useGetObjectTypes,
  useGetObjectTypesChild,
  useGetTemplateObject,
  useGetTemplateObjects,
  useGetTemplatesByFilter,
  useGetTemplatesDepth,
  useUpdateTemplate,
  getAllNotValidParams,
  TreeObjectTypes,
} from '5_entites';
import { ObjectTemplatesListActions } from '5_entites/inventory/templates/ui/objectTemplatesListActions/ObjectTemplatesListActions';
import { useObjectTypesData } from '3_widgets/inventory/leftPanel/lib/useObjectTypesData';

const ObjectTemplates = () => {
  const theme = useTheme();
  const translate = useTranslate();
  const form = useForm();
  const { unregister, reset } = form;

  const { Sidebar, SidebarBody, SidebarHeader, Container } = SidebarLayout;

  const permissions = useGetPermissions('templates');

  const { parentId, selectedObjectTypeItem: selectedObjectType } = useHierarchy();

  const [searchValue, setSearchValue] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<IObjectTemplateModel | null>(null);
  const [editTemplateId, setEditTemplateId] = useState<number | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isDeleteTemplateOpen, setIsDeleteTemplateOpen] = useState(false);
  const [mode, setMode] = useState<TemplateMode>('create');
  const [createChildTemplateIds, setCreateChildTemplateIds] =
    useState<ICreateChildTemplateIds | null>(null);
  const [objectTypeHashNames, setObjectTypeHashNames] = useState<Record<number, string>>({});
  const [isEditTemplateName, setIsEditTemplateName] = useState(false);
  const [isNotValidModalOpen, setIsNotValidModalOpen] = useState(false);
  const [notValidTemplateParams, setNotValidTemplateParams] = useState<
    INotValidParamWithObjectType[]
  >([]);

  const { updateTemplateFn } = useUpdateTemplate();
  const { deleteTemplateFn } = useDeleteTemplate();
  const { exportTemplateFn } = useExportTemplate();

  const { objectTypesData, isFetching: isFetchingObjectTypes } = useGetObjectTypes({});

  const searchDebounceValue = useDebounceValue(searchValue);

  const objectTypesServerData = useObjectTypesData({
    searchValue: searchDebounceValue,
  });

  const { templateDepth } = useGetTemplatesDepth({
    tmoId: selectedObjectType?.id || 0,
    skip: !selectedObjectType,
  });

  const { data: objectTypes, isFetching: isFetchingObjectTypesChild } = useGetObjectTypesChild({
    parentId,
  });

  const { data: templatesData, isFetching: isTemplatesFetching } = useGetTemplatesByFilter({
    objectTypeId: selectedObjectType?.id || 0,
    skip: !selectedObjectType,
  });

  const { data: templateObjectsData, isFetching: isTemplateObjectsFetching } =
    useGetTemplateObjects({
      templateId: selectedTemplate?.id || 0,
      depth: templateDepth,
      includeParameters: true,
      skip: !selectedTemplate || !!editTemplateId,
    });

  const { data: templateObjectData, isFetching: isTemplateObjectFetching } = useGetTemplateObject({
    id: editTemplateId || 0,
    includeParameters: true,
    skip: !editTemplateId || mode !== 'edit',
  });

  useEffect(() => {
    if (mode !== 'create') {
      unregister('templateName');
    }
  }, [mode, unregister]);

  useEffect(() => {
    if (!templatesData?.data?.length) {
      setSelectedTemplate(null);
      return;
    }
    if (templatesData.data?.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templatesData.data[0]);
    }
  }, [templatesData?.data, selectedTemplate]);

  useEffect(() => {
    if (!objectTypesData) return;

    const objectTypeNames = objectTypesData.reduce((acc, objectType) => {
      acc[objectType.id] = objectType.name;
      return acc;
    }, {} as Record<number, string>);

    setObjectTypeHashNames(objectTypeNames);
  }, [objectTypesData]);

  const objectTmoId = useMemo(() => {
    if (mode === 'edit' && templateObjectData) {
      return templateObjectData.object_type_id;
    }

    if (mode === 'createChild') {
      return createChildTemplateIds?.object_type_id;
    }

    return selectedObjectType?.id;
  }, [createChildTemplateIds?.object_type_id, mode, selectedObjectType?.id, templateObjectData]);

  const { objectTypeParamTypes, isObjectTypesParamTypesFetching } = useGetObjectTypeParamTypes({
    objectTmoId,
  });

  const onSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setSearchValue(event.target.value);
  };

  const onTemplateClick = (template: IObjectTemplateModel) => {
    setSelectedTemplate(template);
  };

  const onNotValidClick = (template: IObjectTemplateModel) => {
    if (!template.valid && templateObjectsData) {
      const notValidParams = getAllNotValidParams(templateObjectsData, objectTypeHashNames);
      if (notValidParams.length > 0) {
        setNotValidTemplateParams(notValidParams);
        setMode('edit');
        setIsNotValidModalOpen(true);
      }
    }
  };

  const onGraphNotValidNodeClick = (objectTypeId: number) => {
    if (!templateObjectsData) return;
    const notValidParams = getAllNotValidParams(
      templateObjectsData,
      objectTypeHashNames,
      objectTypeId,
    );

    if (notValidParams.length > 0) {
      setNotValidTemplateParams(notValidParams);
      setMode('edit');
      setIsNotValidModalOpen(true);
    }
  };

  const onCreateTemplateClick = async () => {
    setMode('create');
    setIsTemplateModalOpen(true);
  };

  const onEditTemplateClick = (template: IObjectTemplateModel) => {
    setSelectedTemplate(template);
    setIsEditTemplateName(true);
  };

  const onCloseEditTemplateName = useCallback(() => {
    if (!selectedTemplate) return;
    setIsEditTemplateName(false);
  }, [selectedTemplate]);

  const onApplyEditTemplateName = useCallback(
    async (newTemplateName: string) => {
      if (!selectedTemplate) return;
      await updateTemplateFn({
        name: newTemplateName,
        template_id: selectedTemplate.id,
        object_type_id: selectedTemplate.object_type_id,
        owner: '',
      });
      onCloseEditTemplateName();
    },
    [onCloseEditTemplateName, selectedTemplate, updateTemplateFn],
  );

  const onDeleteTemplateClick = async (template: IObjectTemplateModel) => {
    setSelectedTemplate(template);
    setIsDeleteTemplateOpen(true);
  };

  const onConfirmDeleteTemplate = async () => {
    if (!selectedTemplate) return;
    await deleteTemplateFn(selectedTemplate.id);
    setSelectedTemplate(null);
    setIsDeleteTemplateOpen(false);
  };

  const onCloseTemplateModal = () => {
    setIsTemplateModalOpen(false);
    setEditTemplateId(null);
  };

  const onCloseNotValidModal = () => {
    setIsNotValidModalOpen(false);
    setNotValidTemplateParams([]);
    reset();
  };

  const onExportTemplate = async () => {
    if (!selectedTemplate) return;
    await exportTemplateFn({ template_ids: [selectedTemplate.id] });
  };

  const secondaryActionSlot = useCallback(
    (slotProps: ISecondaryActionSlotProps) => (
      <ObjectTemplatesListActions
        {...slotProps}
        onEditTemplateClick={onEditTemplateClick}
        onApplyEditTemplateName={onApplyEditTemplateName}
        onCloseEditTemplateName={onCloseEditTemplateName}
        onDeleteTemplateClick={onDeleteTemplateClick}
        permissions={permissions}
      />
    ),
    [onApplyEditTemplateName, onCloseEditTemplateName, permissions],
  );

  return (
    <SidebarLayout>
      <FormProvider {...form}>
        <Sidebar background={theme.palette.neutral.surfaceContainerLow} collapsible>
          <SidebarHeader>
            <Box component="div" marginTop="0.5rem" display="flex" alignItems="center" gap="5%">
              <CustomSearch
                IconPosition="right"
                placeHolderText={translate('Search')}
                value={searchValue}
                setSearchValue={setSearchValue}
                onChange={(event) => onSearchValueChange(event)}
                searchedValue={searchValue}
                objectTypes={objectTypes}
                isFetchingObjectTypes={isFetchingObjectTypesChild}
                anchor="object"
              />
              <IconButton
                onClick={onCreateTemplateClick}
                disabled={permissions?.update !== true || !selectedObjectType}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '6px',
                }}
              >
                <AddIcon sx={{ fill: theme.palette.common.white }} />
              </IconButton>
            </Box>
          </SidebarHeader>

          <SidebarBody>
            <Box component="div" sx={{ height: '60%' }}>
              <TreeObjectTypes
                {...objectTypesServerData}
                permissions={permissions}
                favorites={[]}
                showParents
                showFavorite={false}
              />
            </Box>
            <Divider />
            <Box component="div" sx={{ height: '38%' }}>
              <ObjectTemplatesList
                selectedTemplateId={selectedTemplate?.id || null}
                templatesData={templatesData}
                isLoading={isTemplatesFetching}
                onTemplateClick={onTemplateClick}
                onNotValidClick={onNotValidClick}
                isSelectedIbjectType={!!selectedObjectType}
                isEditTemplateName={isEditTemplateName}
                secondaryActionSlot={(slotProps) => secondaryActionSlot(slotProps)}
                permissions={permissions}
              />
            </Box>
          </SidebarBody>
        </Sidebar>

        <Container sx={{ position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <IconButton
              size="small"
              onClick={onExportTemplate}
              disabled={permissions?.update !== true || !selectedTemplate}
              sx={{
                backgroundColor: theme.palette.primary.main,
                zIndex: 2,
                borderRadius: '6px',
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.secondary.main,
                  opacity: 0.5,
                },
              }}
            >
              <FileDownloadIcon sx={{ fill: theme.palette.common.white }} />
            </IconButton>
          </Box>
          <TemplateGraph
            selectedObjectType={selectedObjectType}
            selectedTemplate={selectedTemplate}
            setCreateChildTemplateIds={setCreateChildTemplateIds}
            setIsTemplateModalOpen={setIsTemplateModalOpen}
            onGraphNotValidNodeClick={onGraphNotValidNodeClick}
            setMode={setMode}
            templateObjectsData={!templatesData?.data?.length ? undefined : templateObjectsData}
            setEditTemplateId={setEditTemplateId}
            objectTypeHashNames={objectTypeHashNames}
            isLoading={
              isTemplateObjectsFetching || isFetchingObjectTypes || isTemplateObjectFetching
            }
            permissions={permissions}
          />
        </Container>

        <ObjectTemplatesFormModal
          objectTypeParamTypes={objectTypeParamTypes}
          templateObjectData={templateObjectData}
          mode={mode}
          selectedTemplate={selectedTemplate}
          selectedObjectType={selectedObjectType}
          createChildTemplateIds={createChildTemplateIds}
          setCreateChildTemplateIds={setCreateChildTemplateIds}
          isTemplateModalOpen={isTemplateModalOpen}
          onCloseTemplateModal={onCloseTemplateModal}
          isLoading={
            isTemplateObjectsFetching || isObjectTypesParamTypesFetching || isTemplateObjectFetching
          }
          permissions={permissions}
        />

        <ConfirmActionModal
          isOpen={isDeleteTemplateOpen}
          onClose={() => setIsDeleteTemplateOpen(false)}
          onConfirmActionClick={onConfirmDeleteTemplate}
          title={`${translate('Are you sure you want to delete')} ${selectedTemplate?.name}?`}
          confirmationButtonText={translate('Delete')}
          withWarningIcon
        />

        <ObjectTemplatesNotValidModal
          isOpen={isNotValidModalOpen}
          onClose={onCloseNotValidModal}
          permissions={permissions}
        >
          <ObjectTemplatesNotValidForm
            notValidTemplateParams={notValidTemplateParams}
            onCloseNotValidModal={onCloseNotValidModal}
          />
        </ObjectTemplatesNotValidModal>
      </FormProvider>
    </SidebarLayout>
  );
};

export default ObjectTemplates;
