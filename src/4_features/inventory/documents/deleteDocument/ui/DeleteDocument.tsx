import { useEffect, useState } from 'react';
import { CircularProgress, Tooltip, TooltipProps } from '@mui/material';
import { useDeleteDocument } from '4_features';
import { ConfirmActionModal, useTranslate } from '6_shared';

import * as SC from './DeleteDocument.styled';

interface IProps {
  documentId: string;
  disabled?: boolean;
  externalSkip?: boolean;
  handleDeleteTempFile?: (id: string) => void;
  tooltipPlacement?: TooltipProps['placement'];
  isDeleteDocumentSatus?: boolean;
}

export const DeleteDocument = ({
  documentId,
  disabled,
  externalSkip,
  handleDeleteTempFile,
  tooltipPlacement,
  isDeleteDocumentSatus,
}: IProps) => {
  const translate = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const { deleteDocument, isDeleteDocumentLoading } = useDeleteDocument();

  useEffect(() => {
    if (isDeleteDocumentSatus) {
      setIsOpen(true);
    }
  }, [isDeleteDocumentSatus]);

  const onConfirmDeleteClose = () => {
    setIsOpen(false);
  };

  const onDeleteClick = () => {
    setIsOpen(true);
  };

  const onFileDelete = async (id: string) => {
    if (id.startsWith('temp_')) {
      handleDeleteTempFile?.(id);
      return;
    }

    await deleteDocument(id, externalSkip);
    onConfirmDeleteClose();
  };

  const onDeleteDocumentClick = async () => {
    await onFileDelete(documentId);
  };

  return (
    <>
      <Tooltip
        title={translate('Delete')}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        placement={tooltipPlacement}
      >
        <SC.LoadingButtonStyled
          onClick={onDeleteClick}
          loading={isDeleteDocumentLoading}
          loadingIndicator={
            <CircularProgress color="primary" size={25} sx={{ marginLeft: '4px' }} />
          }
          disabled={disabled}
        >
          <SC.DeleteIconStyled />
        </SC.LoadingButtonStyled>
      </Tooltip>

      <ConfirmActionModal
        isOpen={isOpen}
        title={`${translate('Are you sure you want to delete')} document ${documentId}`}
        confirmationButtonText={translate('Delete')}
        onClose={onConfirmDeleteClose}
        onConfirmActionClick={onDeleteDocumentClick}
        withWarningIcon
      />
    </>
  );
};
