import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Button, Typography } from '@mui/material';
import React, { ChangeEvent, useRef } from 'react';
import {
  HiddenInput,
  UploadZoneContent,
  UploadZoneContentText,
  UploadZoneStyled,
} from './UploadZone.styled';
import { useImageUpload } from '../lib/useImageUpload';
import { IFile } from '../type';
import { fileConvert } from '../lib/fileConvert';
import { LoadingContainer } from '../../loadingContainer';
import { LoadingAvataa } from '../../loadingAvataa';

interface IProps {
  onFileUpload: (file: File) => void;
  setUploadedImages?: (images: IFile | null) => void;
  isLoading?: boolean;

  accept?: string;
}

export const UploadZone = ({ setUploadedImages, onFileUpload, accept, isLoading }: IProps) => {
  const dropContainer = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { onDrop, onDragOver, onDragEnter, onPaste, isDragging, onDragLeave } = useImageUpload({
    dropContainerRef: dropContainer,
  });

  const onUpload = (file: File) => {
    onFileUpload(file);
    setUploadedImages?.(fileConvert(file));
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e?.target?.files ?? []);
    const lastImageFile = files[files.length - 1];
    onUpload(lastImageFile);
    e.target.value = ''; // Сброс input
  };

  return (
    <UploadZoneStyled
      ref={dropContainer}
      isDragging={isDragging}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onPaste={(e) => {
        const file = onPaste(e);
        onUpload(file);
      }}
      onDrop={(e) => {
        const file = onDrop(e);
        onUpload(file);
      }}
    >
      <HiddenInput
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileInputChange}
      />

      <UploadZoneContent>
        {isLoading && (
          <LoadingContainer>
            <LoadingAvataa />
          </LoadingContainer>
        )}
        <Button color="inherit" onClick={() => fileInputRef.current?.click()}>
          <FileUploadOutlinedIcon sx={{ mr: 1 }} />
          Choose an file
        </Button>
        <UploadZoneContentText>
          <Typography variant="body2">Drag the file here</Typography>
          <Typography variant="body2">or click for file selection</Typography>
          <Typography variant="body2">You can also insert the file through Ctrl+V</Typography>
        </UploadZoneContentText>
      </UploadZoneContent>
    </UploadZoneStyled>
  );
};
