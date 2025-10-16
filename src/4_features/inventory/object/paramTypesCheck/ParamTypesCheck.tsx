import { Button } from '@mui/material';
import { DataGridPremium, GridRowId } from '@mui/x-data-grid-premium';
import {
  Modal,
  parameterTypesApi,
  useTranslate,
  getDataFromExcelFile,
  useBatchImport,
  DATA_MODEL_SHEET_NUMBER,
  CheckImportedTprmTableRow,
} from '6_shared';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { checkIsTprmColumn } from '5_entites';
import { useGetColumns } from './lib/useGetColumns';
import { createRowsArray } from '../paramTypesPreview';
import { BlankColumn } from '../createNewTprms';

interface ParamTypesCheckProps {
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
  objectTypeId: number;
  paramTypeNames: string[];
  onConfirm: (blankColumns: BlankColumn[]) => void;
  onFileSend: () => Promise<Blob>;
  saveAsFile: (data: Blob) => Promise<void>;
}

export const ParamTypesCheck = ({
  isOpen,
  onCancel,
  onClose,
  paramTypeNames,
  onConfirm,
  objectTypeId,
  onFileSend,
  saveAsFile,
}: ParamTypesCheckProps) => {
  const { useGetObjectTypeParamTypesQuery } = parameterTypesApi;

  const translate = useTranslate();

  const { setDataModelRows, setColumnNameMapping } = useBatchImport();

  const [rowsToCheck, setRowsToCheck] = useState<ReturnType<typeof createRowsArray>>([]);

  const { data: existingParamTypes, isFetching: isExistingParamTypesFetching } =
    useGetObjectTypeParamTypesQuery({ id: objectTypeId });

  // Create tprm rows according data from file loaded by user and existing tprms
  useEffect(() => {
    setRowsToCheck(createRowsArray(paramTypeNames, existingParamTypes ?? []));
  }, [existingParamTypes, paramTypeNames]);

  // onChange function for autocomplete
  const handleTprmSelectChange = (
    rowId: GridRowId,
    newValue: { label: string; value: string | number },
  ) => {
    setRowsToCheck((prevState) =>
      prevState.map((currentRow) =>
        currentRow.id === rowId
          ? {
              ...currentRow,
              selectTprm: newValue,
            }
          : currentRow,
      ),
    );
  };

  // Get options that were not selected
  const getFilteredOptions = useCallback(
    (rows: CheckImportedTprmTableRow[], options: { label: string; value: string | number }[]) => {
      const tableLabels = rows.map((itm) => itm.selectTprm.label);

      return options.filter((item) => !tableLabels.includes(item.label));
    },
    [],
  );

  // Rows that are exactly the tprms (NOT ATTRIBUTES)
  const rowsWithoutAttributes = useMemo(
    () => rowsToCheck.filter((row) => checkIsTprmColumn(row.tprm)),
    [rowsToCheck],
  );

  // Get table columns with autocomplete
  const columns = useGetColumns({
    tprmSelectOptions: getFilteredOptions(
      rowsWithoutAttributes,
      existingParamTypes?.map((item) => ({ label: item.name, value: item.id })) ?? [],
    ),
    onTprmSelectChange: handleTprmSelectChange,
  });

  // Columns mapping for request body
  const columnNameMapping: Record<string, string> = useMemo(() => {
    return rowsWithoutAttributes.reduce((acc, curr) => {
      acc[curr.tprm] = curr.selectTprm.label;
      return acc;
    }, {} as { [key: string]: string });
  }, [rowsWithoutAttributes]);

  useEffect(() => {
    setColumnNameMapping(columnNameMapping);
  }, [columnNameMapping]);

  // Apply click function
  const onApplyClick = useCallback(async () => {
    const blankColumns = rowsToCheck.flatMap((item) => {
      if (item.selectTprm.value !== '' || !checkIsTprmColumn(item.tprm)) return [];
      return {
        id: item.id,
        name: item.tprm,
      };
    });

    if (!blankColumns.length) {
      const fileResponse = await onFileSend();

      if (fileResponse) {
        await saveAsFile(fileResponse);

        const { rows: dataModelRows } = await getDataFromExcelFile(
          fileResponse,
          DATA_MODEL_SHEET_NUMBER,
        );
        setDataModelRows(dataModelRows);
      }
    }

    onConfirm(blankColumns);
  }, [onConfirm, onFileSend, rowsToCheck, saveAsFile]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={translate('Set column names')}
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
          <Button onClick={onApplyClick} variant="contained" color="primary">
            {translate('Continue')}
          </Button>
        </>
      }
    >
      <DataGridPremium
        sx={{ height: 'auto' }}
        columns={columns}
        rows={rowsWithoutAttributes}
        loading={isExistingParamTypesFetching}
        disableVirtualization
      />
    </Modal>
  );
};
