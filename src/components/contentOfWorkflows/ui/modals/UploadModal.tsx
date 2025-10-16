import { useEffect, useRef, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { Button, TextField, Typography } from '@mui/material';
import { CloudDone, CloudDownload } from '@mui/icons-material';
import { Modal, Box, useTranslate, useWorkflows } from '6_shared';
import { getXmlAttributeValue } from '../../lib';
import { DropContainer } from '../ContentOfWorkflows.styled';

export const UploadModal = () => {
  const translate = useTranslate();

  const {
    isUploadModalActive,
    uniqueWorkflowsNames,
    setActiveItem,
    setIsDiagramChanged,
    setIsUploadModalActive,
    setNewItem,
  } = useWorkflows();

  const file = useRef<File>();
  const [isFileValid, setIsFileValid] = useState(true);
  const [isError, setIsError] = useState(false);
  const [fileName, setFileName] = useState<null | string>(null);
  const [isEditingFileName, setIsEditingFileName] = useState(false);

  useEffect(() => {
    if (!fileName) return;
    const trimmedFileName = fileName.split('.')[0];
    setIsError(uniqueWorkflowsNames.includes(trimmedFileName));

    if (uniqueWorkflowsNames.includes(trimmedFileName)) {
      enqueueSnackbar({
        variant: 'warning',
        message: translate('Workflow name already exists'),
      });
    }
  }, [fileName, uniqueWorkflowsNames, translate]);

  const [, drop] = useDrop(() => ({
    accept: NativeTypes.FILE,
    drop({ files }: any) {
      if (files.length > 1 || !/\.bpmn$/.test(files[0]?.name)) {
        setIsFileValid(false);
        setFileName(null);
      } else {
        // eslint-disable-next-line prefer-destructuring
        file.current = files[0];
        setIsFileValid(true);
        setIsError(false);
        setFileName(files[0].name);
      }
    },
  }));

  const onModalClose = () => {
    setIsUploadModalActive(false);
    setIsFileValid(true);
    setIsError(false);
    setFileName(null);
  };

  const handleFileAdd = async () => {
    if (!file.current) return;
    try {
      if (file.current) {
        const reader = new FileReader();
        reader.readAsText(file.current, 'UTF-8');
        reader.onload = (event) => {
          const xml = event.target?.result;
          if (!xml || typeof xml !== 'string') return;

          const bpmnDiagramName = getXmlAttributeValue({
            xml,
            attributeName: 'name',
            tagName: 'bpmn:process',
          });

          const newItem = {
            name: fileName || bpmnDiagramName || 'New Diagram',
            key: 0,
            version: 0,
            bpmnProcessId: '1',
            timestamp: new Date().toISOString(),
          };

          setNewItem({
            isCollapsed: false,
            item: { ...newItem, diagramXml: xml },
          });

          setActiveItem({
            isCollapsed: false,
            item: newItem,
          });
          setIsDiagramChanged(true);
          onModalClose();
        };
        reader.onerror = () => {
          throw new Error('Error while reading the file content');
        };
      }
    } catch (error) {
      enqueueSnackbar({ variant: 'error', message: error.data.detail });
      setIsError(true);
    }
  };

  const handleBrowseClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.bpmn';
    input.onchange = (event) => {
      const selectedFile = (event.target as HTMLInputElement).files?.[0];
      if (selectedFile) {
        file.current = selectedFile;
        setIsFileValid(true);
        if (isError) setIsError(false);
        setFileName(file.current.name);
      }
    };
    input.click();
  };

  return (
    <Modal
      title={translate('Upload')}
      open={isUploadModalActive}
      minWidth="400px"
      onClose={onModalClose}
      actions={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4%' }}>
            {fileName && <CloudDone color="success" />}
            {!isEditingFileName && fileName && (
              <Typography onClick={() => setIsEditingFileName(true)}>{fileName || ' '}</Typography>
            )}
            {isEditingFileName && (
              <TextField
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onBlur={() => setIsEditingFileName(false)}
                autoFocus
              />
            )}
          </Box>
          <Button disabled={!fileName || isError} variant="contained" onClick={handleFileAdd}>
            {translate('Add')}
          </Button>
        </Box>
      }
    >
      <DropContainer
        ref={drop}
        isfilevalid={(isFileValid && !isError).toString() as 'true' | 'false'}
      >
        <CloudDownload
          color={isFileValid && !isError ? 'primary' : 'error'}
          sx={{ fontSize: 70 }}
        />
        <Typography sx={{ fontSize: '18px' }}>{translate('Drag & Drop')}</Typography>
        <Typography component="span">
          {translate('or')}{' '}
          <Typography
            component="span"
            color="primary"
            sx={{ fontSize: '16px', cursor: 'pointer' }}
            onClick={handleBrowseClick}
          >
            {translate('browse')}
          </Typography>
        </Typography>

        <Typography color={isFileValid ? 'secondary' : 'error'} sx={{ fontSize: '12px' }}>
          {translate('Supports')}: .bpmn
        </Typography>
      </DropContainer>
    </Modal>
  );
};
