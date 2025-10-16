import { useMemo } from 'react';
import { AddNewDocument } from '4_features';
import { FileViewer, useGetDocumentsById } from '5_entites';
import { KanbanFileViewer } from '5_entites/inventory/fileViewer';
import { Modal, ActionTypes, IFileData } from '6_shared';
import * as SC from './FileViewerWidget.styled';

interface IProps {
  objectId?: number | null;
  isOpen?: boolean;
  onClose?: () => void;
  withModal?: boolean;
  permissions?: Record<ActionTypes, boolean>;
  isKanban?: boolean;
  tempFiles?: IFileData[];
  handleAddTempFiles?: (newFile: IFileData) => void;
  handleDeleteTempFile?: (id: string) => void;
}

export const FileViewerWidget = ({
  objectId,
  isOpen,
  onClose,
  withModal,
  permissions,
  isKanban = false,
  tempFiles,
  handleAddTempFiles,
  handleDeleteTempFile,
}: IProps) => {
  const {
    data,
    isFetching: isFetchingFileData,
    isError: isErrorFileData,
    refetch: fileDataRefetchFn,
  } = useGetDocumentsById({
    objectId: objectId!,
    skip: objectId === null || objectId === undefined,
  });

  const refetchFileData = () => {
    fileDataRefetchFn();
  };

  const actualFileData = useMemo(
    () => (tempFiles && tempFiles.length > 0 ? tempFiles : data),
    [data, tempFiles],
  );

  if (withModal && onClose) {
    return (
      <Modal open={!!isOpen} onClose={onClose}>
        <SC.ModalBody>
          <SC.FileViewerWidgetStyled>
            <FileViewer
              fileData={actualFileData}
              isFetchingFileData={isFetchingFileData}
              isErrorFileData={isErrorFileData}
              refetchFileData={refetchFileData}
              permissions={permissions}
              handleDeleteTempFile={handleDeleteTempFile}
              uploadFileSlot={
                <AddNewDocument
                  objectId={objectId}
                  permissions={permissions}
                  handleAddTempFiles={handleAddTempFiles}
                />
              }
            />
          </SC.FileViewerWidgetStyled>
        </SC.ModalBody>
      </Modal>
    );
  }

  return (
    <SC.FileViewerWidgetStyled>
      {isKanban && (
        <KanbanFileViewer
          fileData={actualFileData}
          uploadFileSlot={
            <AddNewDocument
              objectId={objectId}
              permissions={permissions}
              externalSkip
              handleAddTempFiles={handleAddTempFiles}
            />
          }
        />
      )}

      {!isKanban && (
        <FileViewer
          fileData={actualFileData}
          isFetchingFileData={isFetchingFileData}
          isErrorFileData={isErrorFileData}
          refetchFileData={refetchFileData}
          permissions={permissions}
          handleDeleteTempFile={handleDeleteTempFile}
          uploadFileSlot={
            <AddNewDocument
              objectId={objectId}
              permissions={permissions}
              handleAddTempFiles={handleAddTempFiles}
            />
          }
        />
      )}
    </SC.FileViewerWidgetStyled>
  );
};
