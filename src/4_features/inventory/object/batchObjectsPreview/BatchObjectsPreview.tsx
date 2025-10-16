import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import {
  getDataFromExcelFile,
  useIndexedDbFileStorage,
  Modal,
  STORED_INVENTORY_IMPORT_PREVIEW_FILE_NAME,
  useTranslate,
  downloadFile,
  Box,
  ERRORS_SHEET_NUMBER,
  SUMMARY_SHEET_NUMBER,
} from '6_shared';
import { ErrorMessage } from './ErrorMessage';
import { ConfirmIfErrorModal } from './ConfirmIfErrorModal';
import { SuccessMessage } from './SuccessMessage';

interface IProps {
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
  onConfirm: () => void;
}

const columns = [
  {
    field: 'label',
    headerName: 'Category',
    flex: 1,
  },
  {
    field: 'value',
    headerName: 'Result',
    flex: 1,
  },
];

export const BatchObjectsPreview = ({ isOpen, onCancel, onClose, onConfirm }: IProps) => {
  const { getFile } = useIndexedDbFileStorage();
  const translate = useTranslate();
  const [rows, setRows] = useState<any[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isConfirmIfErrorModalOpen, setIsConfirmIfErrorModalOpen] = useState<boolean>(false);

  const getPreview = useCallback(async () => {
    const fileData = await getFile(STORED_INVENTORY_IMPORT_PREVIEW_FILE_NAME);
    if (!fileData) return null;

    const { rows: parsedRows, columnIds: parsedColumns } = await getDataFromExcelFile(
      fileData.content,
      SUMMARY_SHEET_NUMBER,
    );

    const { rows: errors } = await getDataFromExcelFile(fileData.content, ERRORS_SHEET_NUMBER);

    return {
      parsedRows,
      parsedColumns,
      errors,
    };
  }, [getFile]);

  useEffect(() => {
    getPreview()
      .then((result) => {
        if (!result) return;

        const { parsedRows, errors } = result;

        const previewInfo = Object.entries(parsedRows[0]).map(([key, value], i) => ({
          label: key,
          value: String(value ?? ''),
          id: i,
        }));

        setRows(previewInfo);
        if (errors.length) {
          setIsError(true);
        }
      })
      .catch((error) => {
        console.error('Error while getting preview:', error);
      });
  }, [getPreview]);

  const onPreviewFileLoad = async () => {
    const fileData = await getFile(STORED_INVENTORY_IMPORT_PREVIEW_FILE_NAME);
    if (!fileData) return null;

    const blob = new Blob([fileData.content]);
    const date = new Date().toISOString();
    const fileName = `batch_import_preview${date}.xlsx`;

    downloadFile({ blob, fileName });

    return undefined;
  };

  const onConfirmClick = () => {
    if (isError) {
      setIsConfirmIfErrorModalOpen(true);
    } else {
      onConfirm();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={translate('Objects import preview')}
      width="60%"
      height="60%"
      withBackButton
      handleBack={onCancel}
      ModalContentSx={{
        overflow: 'hidden',
        height: '100%',
      }}
      hideBackdrop
      actions={
        <>
          <Button onClick={onPreviewFileLoad} variant="contained" color="primary">
            {translate('Load preview file')}
          </Button>
          <Button onClick={onConfirmClick} variant="contained" color="primary">
            {translate('Confirm')}
          </Button>
        </>
      }
    >
      <Box sx={{ width: '100%' }}>
        <DataGridPremium sx={{ fontSize: '20px' }} columns={columns} rows={rows} hideFooter />
        {isError ? <ErrorMessage /> : <SuccessMessage />}
        <ConfirmIfErrorModal
          isOpen={isConfirmIfErrorModalOpen}
          onClose={() => setIsConfirmIfErrorModalOpen(false)}
          onConfirm={onConfirm}
        />
      </Box>
    </Modal>
  );
};
