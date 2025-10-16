import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { TabContext, TabPanel } from '@mui/lab';

import {
  ParamTypesPreview,
  ParamTypesPreviewProps,
} from '4_features/inventory/object/paramTypesPreview';
import {
  BlankColumn,
  ConfirmTprmCreationModal,
  CreateNewTprmsModal,
  CreateNewTprmsModalProps,
  useCheckTprmBatchUpdate,
  useTprmBatchUpdate,
} from '4_features/inventory/object/createNewTprms';
import {
  ATTRIBUTES_IGNORED_IN_BATCH_IMPORT,
  IImportedFileRow,
  ImportDelimiter,
  Modal,
  STORED_INVENTORY_IMPORT_PREVIEW_FILE_NAME,
  useBatchImport,
  useIndexedDbFileStorage,
  useSetState,
} from '6_shared';
import {
  ParamTypesCheck,
  LoadedFilePreview,
  BatchObjectsPreview,
  useImportObjectsAndGetPreview,
  CsvRowArray,
  generateCsvFile,
} from '4_features';

interface ImportObjectsToInventoryWidgetProps {
  objectTypeId: number;
  paramTypeNames: string[];
  isOpen: boolean;
  onClose: () => void;
  filePreviewRows: IImportedFileRow[];
  delimiter: ImportDelimiter;
  onConfirm?: () => void;
  isScheduled?: boolean;
}

interface ModalState {
  loadedFilePreviewModal: boolean;
  checkImportedTprmModal: boolean;
  tprmPreviewModal: boolean;
  createNewTprmsModal: boolean;
  confirmTprmCreationModal: boolean;
  confirmObjectsImportModal: boolean;
  batchObjectsPreviewModal: boolean;
}

const initialModalState = {
  loadedFilePreviewModal: true,
  tprmPreviewModal: false,
  checkImportedTprmModal: false,
  createNewTprmsModal: false,
  confirmTprmCreationModal: false,
  confirmObjectsImportModal: false,
  batchObjectsPreviewModal: false,
};

export const ImportObjectsToInventoryWidget = ({
  isOpen,
  onClose,
  objectTypeId,
  paramTypeNames,
  filePreviewRows,
  delimiter,
  onConfirm,
  isScheduled,
}: ImportObjectsToInventoryWidgetProps) => {
  const { columnNameMapping, isForcedFileSend } = useBatchImport();

  const [newParamTypes, setNewParamTypes] = useState<BlankColumn[]>([]);

  const newConfirmedTprms = useRef<Record<string, any>[] | null>(null);

  const [modalState, setModalState] = useSetState<ModalState>(initialModalState);

  const [checkTprmBatchUpdate, { data: checkTprmBatchUpdateData }] = useCheckTprmBatchUpdate();
  const [tprmBatchUpdate] = useTprmBatchUpdate();

  const closeWidget = () => {
    setModalState(initialModalState);
    onClose();
  };

  // File Preview Modal
  const filePreviewColumns = paramTypeNames.map((paramType) => ({
    field: paramType,
  }));

  // Delete attribute field, add id field for DataGrid
  const filePreviewRowsWithoutAttributes = useMemo(() => {
    return filePreviewRows.map((row, id) => {
      return ATTRIBUTES_IGNORED_IN_BATCH_IMPORT.reduce((acc, field) => {
        const { [field]: _, ...rest } = acc;
        return { ...rest, id };
      }, row);
    });
  }, [filePreviewRows]);

  const onTprmsCheckConfirm = (blankColumns: BlankColumn[]) => {
    if (blankColumns.length) {
      setNewParamTypes(blankColumns);
      setModalState({ createNewTprmsModal: true });
    } else {
      setModalState({ tprmPreviewModal: false, checkImportedTprmModal: true });
    }
  };

  const handleCreateNewTprmsModalConfirm: CreateNewTprmsModalProps['onConfirm'] = async (value) => {
    newConfirmedTprms.current = value;
    checkTprmBatchUpdate(objectTypeId, value).then(() => {
      setModalState({ confirmTprmCreationModal: true });
    });
  };

  const handleNewTprmCreation = async () => {
    if (!newConfirmedTprms.current) return;

    tprmBatchUpdate(objectTypeId, newConfirmedTprms.current).then(() => {
      setModalState({ confirmTprmCreationModal: false, createNewTprmsModal: false });
      newConfirmedTprms.current = null;
    });
  };

  const handleCheckImportedTprm: ParamTypesPreviewProps['onConfirm'] = () => {
    setModalState({ batchObjectsPreviewModal: true });
  };

  // Generate CSV file for preview
  const csvFileRows = useMemo(() => {
    return filePreviewRowsWithoutAttributes.reduce<CsvRowArray[]>((acc, row) => {
      const { id, ...rest } = row;
      return [...acc, Object.values(rest)];
    }, []);
  }, [filePreviewRowsWithoutAttributes]);

  const fileForPreview = useMemo(() => {
    return generateCsvFile(paramTypeNames, csvFileRows, delimiter);
  }, [csvFileRows, delimiter, paramTypeNames]);

  // Get import preview file from server
  const { importObjectsAndGetPreview: getPreview } = useImportObjectsAndGetPreview({
    columnNameMapping,
    objectTypeId,
    file: fileForPreview as Blob,
    delimiter,
    purpose: 'preview',
  });

  // Save preview file received from server
  const { saveFile } = useIndexedDbFileStorage();

  const saveAsFile = useCallback(
    async (data: Blob) => {
      const fileToSave = new File([data], STORED_INVENTORY_IMPORT_PREVIEW_FILE_NAME);

      await saveFile(fileToSave, STORED_INVENTORY_IMPORT_PREVIEW_FILE_NAME);
    },
    [saveFile],
  );

  // Import Objects
  const { importObjectsAndGetPreview: importObjects } = useImportObjectsAndGetPreview({
    columnNameMapping,
    objectTypeId,
    file: fileForPreview as Blob,
    delimiter,
    purpose: 'import',
    isForcedFileSend,
  });

  const handleConfirm = () => {
    closeWidget();
    onConfirm?.();
    if (!isScheduled) importObjects();
  };

  // Ordered modals
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!modalState) return;

    const modalKey = Object.entries(modalState)
      .reverse()
      .find(([_, val]) => val)?.[0];

    if (modalKey) {
      setValue(modalKey);
    }
  }, [modalState]);

  if (isOpen)
    return (
      <TabContext value={value}>
        <Modal open={isOpen} onClose={closeWidget}>
          <TabPanel value="loadedFilePreviewModal">
            <LoadedFilePreview
              isOpen
              onClose={closeWidget}
              columns={filePreviewColumns}
              rows={filePreviewRowsWithoutAttributes}
              onConfirm={() => setModalState({ tprmPreviewModal: true })}
            />
          </TabPanel>
          <TabPanel value="tprmPreviewModal">
            <ParamTypesCheck
              isOpen
              onCancel={() => setModalState({ tprmPreviewModal: false })}
              onClose={closeWidget}
              objectTypeId={objectTypeId}
              paramTypeNames={paramTypeNames}
              onConfirm={onTprmsCheckConfirm}
              onFileSend={getPreview as () => Promise<Blob>}
              saveAsFile={saveAsFile}
            />
          </TabPanel>
          <TabPanel value="checkImportedTprmModal">
            <ParamTypesPreview
              isOpen
              onCancel={() => setModalState({ checkImportedTprmModal: false })}
              onClose={closeWidget}
              onConfirm={handleCheckImportedTprm}
              onFileSend={getPreview as () => Promise<Blob>}
              saveAsFile={saveAsFile}
            />
          </TabPanel>
          <TabPanel value="createNewTprmsModal">
            <CreateNewTprmsModal
              isOpen
              onCancel={() => setModalState({ createNewTprmsModal: false })}
              onClose={closeWidget}
              onConfirm={handleCreateNewTprmsModalConfirm}
              newParamTypes={newParamTypes}
            />
          </TabPanel>
          <TabPanel value="confirmTprmCreationModal">
            <ConfirmTprmCreationModal
              isOpen
              onCancel={() => setModalState({ confirmTprmCreationModal: false })}
              onClose={closeWidget}
              onConfirm={handleNewTprmCreation}
              data={checkTprmBatchUpdateData}
            />
          </TabPanel>
          <TabPanel value="batchObjectsPreviewModal">
            <BatchObjectsPreview
              isOpen
              onCancel={() => setModalState({ batchObjectsPreviewModal: false })}
              onClose={closeWidget}
              onConfirm={handleConfirm}
            />
          </TabPanel>
        </Modal>
      </TabContext>
    );

  return null;
};
