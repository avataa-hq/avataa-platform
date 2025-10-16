import { useRef, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import {
  Autocomplete,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { CloudDone, CloudDownload } from '@mui/icons-material';
import { useCreateLayer } from '5_entites/inventory/layers/api';
import { Modal, Box, useTranslate, IFolderModel, ICreateLayerBody, useLayersSlice } from '6_shared';
import { DropContainer } from './UploadLayerModal.styled';

interface IProps {
  foldersData: IFolderModel[] | undefined;
}

export const UploadLayerModal = ({ foldersData }: IProps) => {
  const translate = useTranslate();

  const { isCreateLayerModalOpen, setIsCreateLayerModalOpen } = useLayersSlice();

  const file = useRef<File>();

  const [isFileValid, setIsFileValid] = useState(true);
  const [isError, setIsError] = useState(false);
  const [fileName, setFileName] = useState<null | string>(null);
  // const [isEditingFileName, setIsEditingFileName] = useState(false);
  const [parentFolder, setParentFolder] = useState<IFolderModel | null>(null);
  const [contentType, setContentType] = useState<'layerFile' | 'tileServer'>('layerFile');
  const [serverUrl, setServerUrl] = useState<null | string>(null);

  const { createLayer } = useCreateLayer();

  const [, drop] = useDrop(() => ({
    accept: NativeTypes.FILE,
    drop({ files }: any) {
      if (files.length > 1 || !/\.(geojson|kml|kmz|shp)$/i.test(files[0]?.name)) {
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
    setIsCreateLayerModalOpen(false);
    setIsFileValid(true);
    setIsError(false);
    setFileName(null);
    setParentFolder(null);
    setServerUrl(null);
  };

  const handleFileAdd = async () => {
    // if (!file.current) return;
    try {
      const formData = new FormData();
      const createLayerBody: ICreateLayerBody = {
        layer_name: fileName ?? '',
        body: formData,
      };

      if (contentType === 'layerFile' && file.current) {
        // const modifiedFileName = fileName || file.current.name;
        // const updatedFile = new File([file.current], modifiedFileName, {
        //   type: file.current.type,
        // });

        formData.append('file', file.current);
        formData.append('layer_name', fileName ?? file.current.name);
        createLayerBody.body = formData;
      }

      if (contentType === 'tileServer' && serverUrl) {
        formData.append('server_link', serverUrl);
      }

      if (parentFolder) {
        formData.append('folder_id', parentFolder.id.toString());
      }

      await createLayer(createLayerBody);
      onModalClose();
    } catch (error) {
      enqueueSnackbar({ variant: 'error', message: error.data.detail });
      setIsError(true);
    }
  };

  const handleBrowseClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.geojson,.kml,.kmz,.shp';
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

  const handleLayerTypeChange = (event: SelectChangeEvent) => {
    setContentType(event.target.value as 'layerFile' | 'tileServer');
    setServerUrl(null);
    setFileName(null);
  };

  return (
    <Modal
      title={translate('Upload')}
      open={isCreateLayerModalOpen}
      minWidth="400px"
      onClose={onModalClose}
      actions={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            marginTop: '5px',
          }}
        >
          {contentType === 'layerFile' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4%', flexGrow: 1 }}>
              {fileName && <CloudDone color="success" />}
              <Typography>{fileName || ' '}</Typography>
              {/* {!isEditingFileName && fileName && (
              <Typography onClick={() => setIsEditingFileName(true)}>{fileName || ' '}</Typography>
            )}
            {isEditingFileName && (
              <TextField
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onBlur={() => setIsEditingFileName(false)}
                autoFocus
              />
            )} */}
            </Box>
          )}

          <Button
            disabled={contentType === 'layerFile' ? !fileName || isError : !serverUrl}
            variant="contained"
            onClick={handleFileAdd}
          >
            {translate('Add')}
          </Button>
        </Box>
      }
    >
      <Box component="div" sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Select value={contentType} onChange={handleLayerTypeChange}>
          <MenuItem value="layerFile">{translate('Layer file')}</MenuItem>
          <MenuItem value="tileServer">{translate('Tile Server')}</MenuItem>
        </Select>

        {contentType === 'layerFile' && (
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
              {translate('Supports')}: .geojson, .kml .kmz .shp
            </Typography>
          </DropContainer>
        )}

        {contentType === 'tileServer' && (
          <>
            <TextField
              label={translate('Server name')}
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              // onBlur={() => setIsEditingFileName(false)}
              autoFocus
            />
            <TextField
              label={translate('Server link')}
              variant="outlined"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
            />
          </>
        )}

        <Box component="div">
          <Typography sx={{ marginBottom: '8px' }}>{translate('Parent folder')}</Typography>
          <Autocomplete
            options={foldersData ?? []}
            // value={foldersData?.find((folder) => folder?.id === value?.id) || null}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label={translate('Select parent folder')} />
            )}
            onChange={(_, newValue) => setParentFolder(newValue)}
            fullWidth
          />
        </Box>
      </Box>
    </Modal>
  );
};
