import { useCallback } from 'react';
import { Button } from '@mui/material';
import { DataGridPremium, GridRowId } from '@mui/x-data-grid-premium';
import { FILE_COLUMN_NAME, IImportedFileRow, Modal, useBatchImport, useTranslate } from '6_shared';
import { useGetColumns } from './lib';

export interface ParamTypesPreviewProps {
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
  onConfirm: () => void;
  onFileSend: () => Promise<Blob>;
  saveAsFile: (data: Blob) => Promise<void>;
}

export const ParamTypesPreview = ({
  isOpen,
  onCancel,
  onClose,
  onConfirm,
  onFileSend,
  saveAsFile,
}: ParamTypesPreviewProps) => {
  const translate = useTranslate();

  const {
    dataModelRows,
    importedFileColumnNames,
    importedFileRows,
    columnNameMapping,
    setDataModelRows,
    setImportedFileColumnNames,
    setImportedFileRows,
    setColumnNameMapping,
  } = useBatchImport();

  // Add ids for rows in DataGrid
  const rowsWithId = dataModelRows.map((row) => {
    return {
      id: row[FILE_COLUMN_NAME],
      ...row,
    };
  });

  // Regenerate columns, rows and mapping when delete some tprm
  const onDeleteClick = useCallback(
    (rowId: GridRowId) => {
      const updatedColumnNames = importedFileColumnNames.filter(
        (columnName) => columnName !== rowId,
      );

      setImportedFileColumnNames(updatedColumnNames);

      const updatedRows = importedFileRows.map((row) => {
        const newRow: IImportedFileRow = {};
        Object.keys(row).forEach((key) => {
          if (key !== rowId) {
            newRow[key] = row[key];
          }
        });

        return newRow;
      });

      setImportedFileRows(updatedRows);

      const { [rowId]: _, ...rest } = columnNameMapping;

      setColumnNameMapping(rest);

      const newRows = rowsWithId.filter((row) => row.id !== rowId);
      setDataModelRows(newRows);
    },
    [importedFileColumnNames, importedFileRows, rowsWithId, columnNameMapping],
  );

  // Get columns
  const columns = useGetColumns({
    onDeleteClick,
  });

  // Get preview file from server and download it to IndexedDB
  const handleAccept = async () => {
    const fileResponse = await onFileSend();

    if (fileResponse) {
      await saveAsFile(fileResponse);
    }

    onConfirm();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={translate('Object param types preview')}
      width="60%"
      height="60%"
      withBackButton
      handleBack={onCancel}
      ModalContentSx={{
        display: 'flex',
        overflow: 'hidden',
        height: '100%',
      }}
      hideBackdrop
      actions={
        <>
          {/* <Button onClick={onCancel} variant="outlined" color="primary">
            {translate('Cancel')}
          </Button> */}
          <Button onClick={handleAccept} variant="contained" color="primary">
            {translate('Continue')}
          </Button>
        </>
      }
    >
      <DataGridPremium
        sx={{ height: 'auto' }}
        columns={columns}
        rows={rowsWithId}
        disableVirtualization
      />
    </Modal>
  );
};
