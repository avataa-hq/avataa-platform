import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Button, Typography } from '@mui/material';
import { FileDownloadOutlined } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import { ImportObjectsToInventoryWidget } from '3_widgets';
import {
  LoadActionForm,
  LoadActionFormInputs,
  LoadActionFormProps,
} from '4_features/ruleManagerDiagram';
import {
  Box,
  Modal,
  getErrorMessage,
  useTranslate,
  dataviewActionApi,
  parameterTypesApi,
  useDataflowDiagramPage,
  useBatchImport,
  useDataflowDiagram,
} from '6_shared';

import { UseFormSetValue } from 'react-hook-form';
import { useGetSourceInfo } from '5_entites/dataflowDiagram/api';
import { checkIsTprmColumn } from '5_entites';

interface CreateNewTprmsWidgetProps<T extends string = string> {
  objectTypeId: number;
  objectParamTypes: { name: T; val_type: string }[];
  isOpen: boolean;
}

const { useLoadActionMutation } = dataviewActionApi;

const formId = 'rule-manager-diagram__load-form';

const createNewTprmsWidgetInitialState = {
  objectParams: [],
  objectParamTypes: [],
  objectTypeId: 0,
  isOpen: false,
};

const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;

export const LoadModal = () => {
  const translate = useTranslate();

  const { isLoadModalOpen, setIsLoadModalOpen } = useDataflowDiagramPage();
  const { newLinkPromise, pipelineId, addNewLink, removeNewLink } = useDataflowDiagram();
  const {
    importedFileColumnNames,
    importedFileRows,
    importDataDelimiter,
    columnNameMapping,
    setImportedFileColumnNames,
    setImportedFileRows,
  } = useBatchImport();

  const formRef = useRef<{ setValue: UseFormSetValue<LoadActionFormInputs> }>(null);
  const [createNewTprmsWidgetProps, setCreateNewTprmsWidgetProps] =
    useState<CreateNewTprmsWidgetProps>(createNewTprmsWidgetInitialState);

  const [loadAction, { isLoading: isLoadActionLoading }] = useLoadActionMutation();

  const { sourceConfig, sourceData } = useGetSourceInfo(newLinkPromise?.value?.source.id);

  const closeModal = () => {
    setIsLoadModalOpen(false);
  };

  const cancel = () => {
    removeNewLink();
    closeModal();
  };

  const onSubmit = async ({
    columns: { id, name, ...columns },
    db_schema,
    destination,
    file_name,
    load_type,
    notify,
    password,
    table_name,
    username,
    users_to_notify,
    ...data
  }: Required<LoadActionFormInputs>) => {
    try {
      if (!newLinkPromise) throw new Error('No new link promise');
      if (!pipelineId) throw new Error('No pipeline id');

      const response = await loadAction({
        pipelineId,
        sourceId: newLinkPromise.value.source.id,
        body: {
          ...data,
          columns,
          location: {
            x: newLinkPromise.value.target.x,
            y: newLinkPromise.value.target.y,
          },
        },
      }).unwrap();

      addNewLink({
        id: response.id,
        name: response.name,
        rows_count: response.rows_count,
        status: 'waiting',
      });
      enqueueSnackbar(translate('Success'), { variant: 'success' });
      closeModal();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  const handleCreateNewTprmsClick = useCallback<
    NonNullable<LoadActionFormProps['onCreateNewTprmsClick']>
  >(
    ({ objectTypeId, paramTypes }) =>
      setCreateNewTprmsWidgetProps({
        objectTypeId,
        objectParamTypes: paramTypes,
        isOpen: true,
      }),
    [],
  );

  // ImportObjectsToInventoryWidget
  useEffect(() => {
    const sourceConfigNames = sourceConfig ? sourceConfig.map((column) => column.name) : [];
    const tprmOnlyColumns = sourceConfigNames.filter((column) => checkIsTprmColumn(column));
    setImportedFileColumnNames(tprmOnlyColumns);
  }, [sourceConfig]);

  useEffect(() => {
    if (sourceData) setImportedFileRows(sourceData);
  }, [sourceData]);

  const { data: paramTypes } = useGetObjectTypeParamTypesQuery(
    { id: createNewTprmsWidgetProps.objectTypeId },
    { skip: !createNewTprmsWidgetProps.objectTypeId },
  );

  const formColumns = useMemo(() => {
    if (!paramTypes || !columnNameMapping) return {};
    return Object.values(columnNameMapping).reduce((acc, column) => {
      return {
        ...acc,
        [column]: paramTypes.find((itm) => itm.name === column)?.id,
      };
    }, {});
  }, [columnNameMapping, paramTypes]);

  const onImportWidgetClose = () => setCreateNewTprmsWidgetProps(createNewTprmsWidgetInitialState);
  const onImportWidgetConfirm = () => {
    formRef.current?.setValue('columns', formColumns);
    onImportWidgetClose();
  };

  return (
    <>
      <Modal
        minWidth="700px"
        open={isLoadModalOpen}
        title={
          <Box display="flex" gap="5px">
            <FileDownloadOutlined />
            <Typography variant="h3" alignSelf="center">
              {translate('Load')}
            </Typography>
          </Box>
        }
        onClose={cancel}
        actions={
          <>
            <Button variant="outlined" onClick={cancel}>
              {translate('Cancel')}
            </Button>
            <LoadingButton
              variant="contained"
              loading={isLoadActionLoading}
              type="submit"
              form={formId}
            >
              {translate('Apply')}
            </LoadingButton>
          </>
        }
      >
        <LoadActionForm
          id={formId}
          ref={formRef}
          sourceId={newLinkPromise?.value?.source.id}
          onSubmit={onSubmit}
          onCreateNewTprmsClick={handleCreateNewTprmsClick}
        />
      </Modal>
      {sourceConfig && sourceData && paramTypes && (
        <ImportObjectsToInventoryWidget
          {...createNewTprmsWidgetProps}
          onClose={onImportWidgetClose}
          onConfirm={onImportWidgetConfirm}
          paramTypeNames={importedFileColumnNames}
          filePreviewRows={importedFileRows}
          delimiter={importDataDelimiter}
          isScheduled
        />
      )}
    </>
  );
};
