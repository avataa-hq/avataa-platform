import React, { ChangeEvent, useRef } from 'react';
import { Add } from '@mui/icons-material';

import { useTranslate, ActionTypes, IFileData, useUser } from '6_shared';

import { IconButton, Tooltip, TooltipProps } from '@mui/material';
import { addNewDocument } from '../lib/addNewDocument';
import { useAddNewDocumentToObject } from '../api/useAddNewDocumentToObject';
import * as SC from './AddNewDocument.styled';

interface IProps {
  objectId: number | string | null | undefined;
  permissions?: Record<ActionTypes, boolean>;
  externalSkip?: boolean;
  handleAddTempFiles?: (newFile: IFileData) => void;
  buttonType?: 'button' | 'iconButton';
  acceptType?: string;
  tooltipTitle?: string;
  tooltipPlacement?: TooltipProps['placement'];
}

export const AddNewDocument = ({
  objectId,
  permissions,
  externalSkip,
  handleAddTempFiles,
  buttonType = 'button',
  acceptType = '',
  tooltipTitle,
  tooltipPlacement = 'top',
}: IProps) => {
  const translate = useTranslate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useUser();

  const { postNewDocument, isError, isLoading } = useAddNewDocumentToObject();

  // const onDownloadFile = async (e: ChangeEvent<HTMLInputElement>) => {
  //   if (
  //     e.currentTarget.files == null ||
  //     !e.currentTarget.files.length ||
  //     objectId === null ||
  //     objectId === undefined
  //   )
  //     return;
  //   const document = e.currentTarget.files[0];
  //   await addNewDocument({ postNewDocument, objectId, document, externalSkip });
  // };

  const onDownloadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files == null || !e.currentTarget.files.length) return;

    if (!objectId) {
      const doc = e.currentTarget.files[0];
      const newFile = {
        attachment: [
          {
            id: `temp_${crypto.randomUUID()}`,
            url: '',
            name: doc.name,
            attachmentType: '',
            mimeType: doc.type,
            size: {
              amount: doc.size,
              units: 'bytes',
            } satisfies IFileData['attachment'][0]['size'],
          } satisfies IFileData['attachment'][0],
        ],
        creationDate: '',
        externalIdentifier: [
          {
            href: '',
            id: '',
            owner: '',
          },
        ],
        lastUpdate: new Date(),
        name: doc.name,
        status: '',
        href: '',
        id: `temp_${crypto.randomUUID()}`,
        tempFile: doc,
      } satisfies IFileData;
      handleAddTempFiles?.(newFile);

      return;
    }

    const document = e.currentTarget.files[0];
    await addNewDocument({ postNewDocument, objectId, document, user, externalSkip });
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      {buttonType === 'button' && (
        <SC.LoadingButtonStyled
          loading={isLoading}
          variant="contained"
          color={isError ? 'error' : 'primary'}
          startIcon={<Add />}
          onClick={onButtonClick}
          size="small"
          disabled={!(permissions?.update ?? true)}
        >
          {translate('Add')}
        </SC.LoadingButtonStyled>
      )}
      {buttonType === 'iconButton' && (
        <Tooltip title={tooltipTitle ?? ''} placement={tooltipPlacement}>
          <IconButton
            onClick={onButtonClick}
            size="small"
            disabled={!(permissions?.update ?? true)}
          >
            <Add />
          </IconButton>
        </Tooltip>
      )}
      <SC.HiddenInput ref={inputRef} type="file" onChange={onDownloadFile} accept={acceptType} />
    </>
  );
};
