import { useEffect, useState } from 'react';
import { Table } from '@mui/material';
import keycloak from 'keycloak';
import { getFileUrl, sortFileData } from '5_entites';
import { IFileData, ActionTypes } from '6_shared';
import { FileViewerTableHead } from '../FileViewerTableHead/FileViewerTableHead';
import { FileViewerTableBody } from '../FileViewerTableBody/FileViewerTableBody';
import * as SC from './FileViewerTable.styled';

interface IProps {
  fileData: IFileData[] | undefined;
  permissions?: Record<ActionTypes, boolean>;
  handleDeleteTempFile?: (id: string) => void;
}

export const FileViewerTable = ({ fileData, permissions, handleDeleteTempFile }: IProps) => {
  const { token } = keycloak;

  const [newFileData, setNewFileData] = useState<IFileData[] | undefined>([]);
  const [sortDirection, setSortDirection] = useState('asc');
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});

  // TODO This is not the best approach for fetching file URLs. It should be replaced with a backend presigned URL for each file.
  useEffect(() => {
    if (fileData) {
      fileData.forEach(async (file) => {
        const attachmentUrl = file?.attachment?.[0]?.url;
        if (attachmentUrl) {
          const blobUrl = await getFileUrl(attachmentUrl, token || '');
          setFileUrls((prev) => ({ ...prev, [file.id]: blobUrl }));
        }
      });
    }
  }, [fileData, token]);

  useEffect(() => {
    if (fileData) {
      const updatedFileData = fileData.map((file) => ({
        ...file,
        attachment: file.attachment.map((attachment) => ({
          ...attachment,
          url: fileUrls[file.id] || attachment.url,
        })),
      }));
      setNewFileData(updatedFileData);
    }
  }, [fileData, fileUrls]);

  const onSortLabelClick = (type: string) => {
    const sortedData = sortFileData({
      newFileData,
      type,
      sortDirection,
      setSortDirection,
    });
    setNewFileData(sortedData);
  };

  return (
    <Table aria-label="collapsible table">
      <SC.TableHeadStyled>
        <FileViewerTableHead onSortLabelClick={onSortLabelClick} />
      </SC.TableHeadStyled>
      <SC.TableBodyStyled>
        {newFileData &&
          newFileData.map((document) =>
            document.attachment.map((file) => (
              <FileViewerTableBody
                key={document.id}
                document={document}
                file={file}
                permissions={permissions}
                handleDeleteTempFile={handleDeleteTempFile}
              />
            )),
          )}
      </SC.TableBodyStyled>
    </Table>
  );
};
