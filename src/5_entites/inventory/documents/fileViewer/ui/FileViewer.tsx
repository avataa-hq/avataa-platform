import React, { useState } from 'react';
import { Search, Close } from '@mui/icons-material';
import { filterFileData, FileViewerTable } from '5_entites';
import {
  ErrorPage,
  IFileData,
  InputWithIcon,
  LoadingAvataa,
  useDebounceValue,
  useTranslate,
  ActionTypes,
} from '6_shared';
import { Typography } from '@mui/material';
import * as SC from './FileViewer.styled';

interface IProps {
  fileData?: IFileData[];
  isFetchingFileData?: boolean;
  isErrorFileData?: boolean;
  refetchFileData?: () => void;
  uploadFileSlot?: React.ReactNode;
  permissions?: Record<ActionTypes, boolean>;
  handleDeleteTempFile?: (id: string) => void;
}

export const FileViewer = ({
  fileData,
  isFetchingFileData,
  isErrorFileData,
  refetchFileData,
  uploadFileSlot,
  permissions,
  handleDeleteTempFile,
}: IProps) => {
  const translate = useTranslate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isInputFilled, setIsInputFilled] = useState(false);

  const debounceValue = useDebounceValue(searchQuery);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsInputFilled(e.target.value.trim() !== '');
    setSearchQuery(e.target.value);
  };

  const onIconClick = () => {
    if (isInputFilled) {
      setSearchQuery('');
      setIsInputFilled(false);
    }
  };

  return (
    <SC.FileViewerStyled>
      {isFetchingFileData && !isErrorFileData && (
        <SC.LoadingContainer>
          <LoadingAvataa />
        </SC.LoadingContainer>
      )}

      {!isFetchingFileData && isErrorFileData && (
        <ErrorPage
          error={{ message: translate('An error has occurred, please try again'), code: '404' }}
          refreshFn={refetchFileData}
        />
      )}

      {!isFetchingFileData && !isErrorFileData && (
        <SC.Header>
          <InputWithIcon
            placeHolderText={translate('Search')}
            widthPercent
            iconPosition="right"
            onChange={onSearchChange}
            value={searchQuery}
            icon={!isInputFilled ? <Search fontSize="small" /> : <Close fontSize="small" />}
            onIconClick={onIconClick}
          />

          {uploadFileSlot}
        </SC.Header>
      )}

      {!isFetchingFileData && !isErrorFileData && fileData?.length !== 0 && (
        <SC.Body>
          <FileViewerTable
            fileData={filterFileData({ fileData, debounceValue })}
            permissions={permissions}
            handleDeleteTempFile={handleDeleteTempFile}
          />
        </SC.Body>
      )}

      {!isFetchingFileData && !isErrorFileData && fileData?.length === 0 && (
        <Typography m={5} variant="body1" component="h1" align="center">
          {translate('This object has no files yet')}
        </Typography>
      )}
    </SC.FileViewerStyled>
  );
};
