import { ChangeEvent, useRef, useState } from 'react';
import { Box, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { alpha } from '@mui/system';
import { useTranslate } from '6_shared';
import { ModelPreview } from '../modelPreview/ModelPreview';
import * as SC from './ObjectModel.styled';

interface IProps {
  inventoryObjectModel: string;
  onFileChange: (newFile: File) => void;
  file: File | null;
}

export const ObjectModel = ({ inventoryObjectModel, onFileChange, file }: IProps) => {
  const translate = useTranslate();
  const theme = useTheme();

  const inputUpload = useRef<HTMLInputElement | null>(null);

  const [modelError, setModelError] = useState(false);
  const [modelPath, setModelPath] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newFile = event?.target?.files?.[0];
    if (newFile) {
      onFileChange(newFile);
    }
  };

  return (
    <SC.ObjectModelStyled>
      {!inventoryObjectModel && <SC.Title>{translate('Add model')}</SC.Title>}
      {inventoryObjectModel && !modelError && (
        <SC.RightContentTitleWrapper>
          <Typography>{translate('Add model')}</Typography>
          <IconButton onClick={() => inputUpload.current?.click()} sx={{ padding: 0 }}>
            <SC.AddIconSmallStyled />
          </IconButton>
        </SC.RightContentTitleWrapper>
      )}
      {!inventoryObjectModel && (
        <SC.UploadArea
          onClick={() => inputUpload.current?.click()}
          sx={{
            backgroundColor:
              file !== null
                ? alpha(theme.palette.success.main, 0.1)
                : theme.palette.neutral.surfaceContainerLowestVariant2,
          }}
        >
          {file !== null ? (
            <DescriptionIcon sx={{ width: '30px', height: '30px' }} />
          ) : (
            <SC.AddIconStyled />
          )}
          <SC.UploadAreaText>
            {inventoryObjectModel && modelError
              ? translate('This object has model')
              : translate('Add model')}
          </SC.UploadAreaText>
        </SC.UploadArea>
      )}

      {inventoryObjectModel && modelError && (
        <Tooltip title={modelPath}>
          <SC.UploadArea
            onClick={() => inputUpload.current?.click()}
            sx={{
              backgroundColor:
                file !== null
                  ? alpha(theme.palette.success.main, 0.1)
                  : theme.palette.neutral.surfaceContainerLowestVariant2,
            }}
          >
            {file !== null ? (
              <DescriptionIcon sx={{ width: '30px', height: '30px' }} />
            ) : (
              <SC.AddIconStyled />
            )}
            <SC.UploadAreaText>
              {inventoryObjectModel && modelError
                ? translate('This object has model')
                : translate('Add model')}
            </SC.UploadAreaText>
          </SC.UploadArea>
        </Tooltip>
      )}

      {inventoryObjectModel && !modelError && (
        <Box
          component="div"
          sx={{
            width: '100%',
            height: '85%',
            border: `1px solid ${theme.palette.neutralVariant.outline}`,
          }}
        >
          <ModelPreview
            modelLink={inventoryObjectModel}
            setModelError={setModelError}
            setModelPath={setModelPath}
          />
          <Typography sx={{ marginTop: '10px' }} variant="subtitle2">
            Supported preview model types: .obj, .fbx, .glb
          </Typography>
        </Box>
      )}
      <SC.HiddenInput ref={inputUpload} type="file" onChange={handleFileChange} />
    </SC.ObjectModelStyled>
  );
};
