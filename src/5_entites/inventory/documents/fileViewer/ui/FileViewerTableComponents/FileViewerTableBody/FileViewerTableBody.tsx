import { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { DeleteDocument, UpdateDocument } from '4_features';
import {
  DownloadFile,
  FileDateTime,
  FileName,
  FileOwner,
  FileStatus,
  FileType,
  FileVersions,
  IFileVersion,
  PreviewFile,
  ShareFile,
} from '5_entites';
import { IFileData, useTranslate, ActionTypes } from '6_shared';
import * as SC from './FileViewerTableBody.styled';

interface IProps {
  document: IFileData;
  file: IFileData['attachment'][0];
  permissions?: Record<ActionTypes, boolean>;
  handleDeleteTempFile?: (id: string) => void;
}

export const FileViewerTableBody = ({
  document,
  file,
  permissions,
  handleDeleteTempFile,
}: IProps) => {
  const translate = useTranslate();
  const theme = useTheme();

  const [isOpenFileVersion, setIsOpenFileVersion] = useState(false);
  const [fileVersions, setFileVersions] = useState<IFileVersion[]>([]);
  const [isDeleteDocumentSatus, setIsDeleteDocumentStatus] = useState(false);

  return (
    <>
      <TableRow sx={{ ...(!!document.tempFile && { opacity: 0.5, pointerEvents: 'none' }) }}>
        <SC.TableCellStyled>
          <FileName fileName={file.name} />
        </SC.TableCellStyled>

        <SC.TableCellStyled>
          <FileType fileType={file.attachmentType} />
        </SC.TableCellStyled>

        <SC.TableCellStyled align="center">
          <DownloadFile fileSize={file.size} fileUrl={file.url} fileName={file.name} />
        </SC.TableCellStyled>

        <SC.TableCellStyled align="center">
          <PreviewFile
            fileType={file.attachmentType}
            fileLink={file.url}
            mimeType={file.mimeType}
          />
        </SC.TableCellStyled>

        <SC.TableCellStyled align="center">
          <UpdateDocument
            fileId={file.id}
            documentId={document.id}
            fileMimeType={file.mimeType}
            disabled={!(permissions?.update ?? true)}
          />
        </SC.TableCellStyled>

        <SC.TableCellStyled align="left">
          <ShareFile fileLink={file.url} />
        </SC.TableCellStyled>

        <SC.TableCellStyled align="left">
          <FileStatus
            document={document}
            disabled={!(permissions?.update ?? true)}
            setIsDeleteDocumentStatus={setIsDeleteDocumentStatus}
          />
        </SC.TableCellStyled>

        <SC.TableCellStyled align="left">
          <FileOwner
            owner={
              document.externalIdentifier.length > 0 ? document.externalIdentifier[0]?.owner : ''
            }
          />
        </SC.TableCellStyled>

        <SC.TableCellStyled align="center">
          <FileDateTime creationDate={document.creationDate} />
        </SC.TableCellStyled>

        <SC.TableCellStyled
          sx={{ ...(!!document.tempFile && { opacity: 1, pointerEvents: 'all' }) }}
        >
          <DeleteDocument
            documentId={document.id}
            disabled={!(permissions?.update ?? true)}
            handleDeleteTempFile={handleDeleteTempFile}
            isDeleteDocumentSatus={isDeleteDocumentSatus}
          />
        </SC.TableCellStyled>

        <SC.TableCellStyled>
          <FileVersions
            isOpenFileVersion={isOpenFileVersion}
            setIsOpenFileVersion={setIsOpenFileVersion}
            fileUrl={file.url}
            setFileVersions={setFileVersions}
          />
        </SC.TableCellStyled>
      </TableRow>

      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            // background: 'rgba(24,27,37,0.32)',
            background: theme.palette.neutralVariant.outline,
          }}
          colSpan={9}
        >
          <Collapse in={isOpenFileVersion} timeout="auto" unmountOnExit>
            <Box
              component="div"
              sx={{
                margin: 1,
                maxHeight: '250px',
                overflowY: 'scroll',
                overflowX: 'hidden',
              }}
            >
              <Typography
                align={fileVersions.length ? 'left' : 'center'}
                variant="subtitle1"
                gutterBottom
                component="h3"
              >
                {fileVersions.length
                  ? `${translate('Versions')} :`
                  : translate('This object has only one version')}
              </Typography>
              <Table sx={{ overflow: 'hidden' }} size="small" aria-label="purchases">
                <TableHead>
                  <TableRow
                    sx={{
                      borderBottom: `1px solid ${theme.palette.neutralVariant.outline}`,
                    }}
                  >
                    <TableCell>{translate('Version Number')}</TableCell>
                    <TableCell align="center">{translate('Version Id')}</TableCell>
                    <TableCell>{translate('Download')}</TableCell>
                    <TableCell>{translate('Preview')}</TableCell>
                    <TableCell>{translate('Last Modified')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fileVersions.length &&
                    fileVersions.map((version, idx) => (
                      <TableRow key={version.version_id}>
                        <TableCell>
                          <Button disabled>{`${idx + 1}.0`}</Button>
                        </TableCell>
                        <TableCell>
                          <FileName fileId={version.version_id} fileName={file.name} />
                        </TableCell>
                        <TableCell>
                          <DownloadFile
                            fileSize={file.size}
                            fileUrl={`${file.url}?version_id=${version.version_id}`}
                            fileName={file.name}
                          />
                        </TableCell>
                        <TableCell>
                          <PreviewFile
                            fileLink={`${file.url}?version_id=${version.version_id}`}
                            fileType={file.attachmentType}
                            mimeType={file.mimeType}
                          />
                        </TableCell>
                        <TableCell>
                          <FileDateTime creationDate={version.last_modified} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
