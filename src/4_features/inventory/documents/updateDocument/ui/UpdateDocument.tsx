import { useRef } from 'react';
import { CircularProgress, Tooltip, TooltipProps } from '@mui/material';
import { useUpdateDocument, updateDocument } from '4_features';
import { useTranslate } from '6_shared';
import * as SC from './UpdateDocument.styled';

interface IProps {
  documentId: string;
  fileId: string;
  fileMimeType: string;
  disabled?: boolean;
  tooltipPlacement?: TooltipProps['placement'];
}

export const UpdateDocument = ({
  documentId,
  fileId,
  fileMimeType,
  disabled,
  tooltipPlacement,
}: IProps) => {
  const translate = useTranslate();
  const { updateDocumentFn, isUpdateDocumentLoading } = useUpdateDocument();

  const inputUpdateRef = useRef<HTMLInputElement | null>(null);

  const onUpdateFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      await updateDocument({ documentId, file, fileId, updateDocumentFn });
    }
  };

  return (
    <Tooltip title={translate('Update')} placement={tooltipPlacement}>
      <SC.LoadingButtonStyled
        loading={isUpdateDocumentLoading}
        onClick={() => inputUpdateRef.current?.click()}
        loadingIndicator={<CircularProgress size={25} sx={{ marginLeft: '4px' }} />}
        disabled={disabled}
      >
        <SC.HiddenInput
          ref={inputUpdateRef}
          type="file"
          onChange={onUpdateFileChange}
          accept={fileMimeType}
        />
        <SC.UpdateIconStyled />
      </SC.LoadingButtonStyled>
    </Tooltip>
  );
};
