import { useCallback, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  useGridApiRef,
  GridRowModesModel,
  GridRowModes,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  DataGridPremium,
} from '@mui/x-data-grid-premium';

import { Modal, UpdateBatchOfParamTypesBodyItem, useTranslate } from '6_shared';

import { useGetColumns, useGetRows } from './hooks';
import { BlankColumn } from './model';

export interface CreateNewTprmsModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
  newParamTypes: BlankColumn[];
  onConfirm: (value: UpdateBatchOfParamTypesBodyItem[]) => void | Promise<void>;
}

export const CreateNewTprmsModal = ({
  isOpen,
  onCancel,
  onClose,
  newParamTypes,
  onConfirm,
}: CreateNewTprmsModalProps) => {
  const translate = useTranslate();
  const initialRows = useGetRows(newParamTypes);
  const [rows, setRows] = useState<any[]>(initialRows);

  const [editingRows, setEditingRows] = useState<GridRowId[]>([]);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setEditingRows([...editingRows, id]);
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const columns = useGetColumns({
    rowModesModel,
    handleDeleteClick,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
  });
  const apiRef = useGridApiRef();

  const onSaveAll = useCallback(() => {
    const newRowModesModel = { ...rowModesModel };
    editingRows.forEach((row) => {
      newRowModesModel[row] = { mode: GridRowModes.View };
      apiRef.current.stopRowEditMode({ id: row });
    });

    setRowModesModel(newRowModesModel);
    setEditingRows([]);
  }, [apiRef, editingRows, rowModesModel]);

  // ************************************************************************************************

  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const handleConfirm = async () => {
    const map = apiRef.current.getRowModels() as Map<
      GridRowId,
      UpdateBatchOfParamTypesBodyItem & { id: number }
    >;
    const arr: UpdateBatchOfParamTypesBodyItem[] = Array.from(map, ([, { id, ...value }]) => value);

    setIsConfirmLoading(true);
    await onConfirm(arr);
    setIsConfirmLoading(false);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={translate('Create new columns')}
      ModalContentSx={{
        display: 'flex',
        overflow: 'hidden',
      }}
      withBackButton
      handleBack={onCancel}
      hideBackdrop
      actions={
        <>
          {/* <Button variant="outlined" onClick={onCancel}>
            {translate('Cancel')}
          </Button> */}
          <Button variant="outlined" onClick={onSaveAll}>
            {translate('Save all changes')}
          </Button>
          <LoadingButton loading={isConfirmLoading} variant="contained" onClick={handleConfirm}>
            {translate('Create columns')}
          </LoadingButton>
        </>
      }
    >
      <DataGridPremium
        sx={{ height: 'auto' }}
        apiRef={apiRef}
        columns={columns}
        rows={rows}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
      />
    </Modal>
  );
};
