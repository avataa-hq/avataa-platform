import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  Typography,
  Dialog,
  IconButton,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  PictureAsPdf,
  Description,
  InsertDriveFile,
  TableChart,
  Close,
  PlayArrow,
} from '@mui/icons-material';
import keycloak from 'keycloak';
import { ActionTypes, IFileData, useTranslate } from '6_shared';
import { DeleteDocument } from '4_features';
import * as SC from './KanbanFileViewer.styled';
import { getFileUrl } from '../documents';

const fileIcons: Record<string, any> = {
  pdf: <PictureAsPdf fontSize="large" color="error" />,
  doc: <Description fontSize="large" color="primary" />,
  docx: <Description fontSize="large" color="primary" />,
  xls: <TableChart fontSize="large" color="success" />,
  xlsx: <TableChart fontSize="large" color="success" />,
  txt: <InsertDriveFile fontSize="large" color="disabled" />,
  default: <InsertDriveFile fontSize="large" color="action" />,
};

const documentsFormats = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
const videoFormats = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv'];

interface IProps {
  fileData: IFileData[] | undefined;
  uploadFileSlot?: React.ReactNode;
  permissions?: Record<ActionTypes, boolean>;
}

export const KanbanFileViewer = ({ fileData, uploadFileSlot, permissions }: IProps) => {
  const translate = useTranslate();
  const { token } = keycloak;

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<IFileData | null>(null);
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

  const handleOpen = async (file: IFileData) => {
    setSelectedFile(file);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  return (
    <SC.KanbanFileViewerStyled>
      <SC.Header>{uploadFileSlot}</SC.Header>

      <SC.Body>
        {fileData &&
          fileData.map((file) => {
            const mimeType = file?.attachment?.[0]?.mimeType;
            const url = fileUrls[file.id] || '';
            // const url = file?.attachment?.[0]?.url;
            const ext = file?.attachment?.[0]?.attachmentType;
            const isImage = mimeType?.startsWith('image/');
            const isVideo =
              (mimeType !== '' && mimeType?.startsWith('video/')) || videoFormats.includes(ext);

            return (
              <Box
                component="div"
                sx={{
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    opacity: 0.8,
                    div: {
                      opacity: 1,
                    },
                  },
                }}
              >
                <Box
                  component="div"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(0, 0, 0, 0.869)',
                    zIndex: 1,
                    opacity: 0,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                >
                  <DeleteDocument
                    documentId={file.id}
                    disabled={!(permissions?.update ?? true)}
                    externalSkip
                  />
                </Box>
                <Card
                  key={file.id}
                  sx={{
                    width: 100,
                    height: 120,
                    textAlign: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    borderRadius: '2px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}
                  onClick={() => handleOpen(file)}
                >
                  {!fileUrls[file.id] && <CircularProgress size={24} sx={{ margin: 'auto' }} />}

                  {fileUrls[file.id] && isImage && (
                    <CardMedia
                      component="img"
                      image={url}
                      alt={file.name}
                      sx={{ objectFit: 'cover', height: '100%' }}
                    />
                  )}
                  {fileUrls[file.id] && isVideo && (
                    <>
                      {/* @ts-ignore */}
                      <CardMedia
                        component="video"
                        src={url}
                        alt={file.name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Box
                        component="div"
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '50px',
                          height: '50px',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: '50%',
                          padding: 1,
                        }}
                      >
                        <PlayArrow fontSize="large" sx={{ color: 'white' }} />
                      </Box>
                    </>
                  )}
                  {!isImage && !isVideo && (
                    <Typography fontSize={40}>
                      {fileIcons[file?.attachment?.[0]?.attachmentType as string] ||
                        fileIcons.default}
                    </Typography>
                  )}

                  <CardContent sx={{ padding: '2px', '&:last-child': { paddingBottom: '2px' } }}>
                    <Typography variant="body2" sx={{ fontSize: 10 }}>
                      {file?.attachment?.[0]?.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            );
          })}

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <Box component="div" position="relative" p={2}>
            <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
              <Close />
            </IconButton>

            {!selectedFile ||
              (selectedFile && !fileUrls[selectedFile.id] && (
                <Box component="div" sx={{ width: '100%', textAlign: 'center', padding: 2 }}>
                  <CircularProgress size={24} sx={{ margin: 'auto' }} />
                </Box>
              ))}

            {selectedFile && fileUrls[selectedFile.id] && (
              <>
                <Typography variant="h6" mb={2}>
                  {selectedFile?.attachment?.[0]?.name}
                </Typography>

                {selectedFile?.attachment?.[0]?.mimeType.startsWith('image/') && (
                  <CardMedia
                    component="img"
                    image={fileUrls[selectedFile.id] || selectedFile?.attachment?.[0]?.url}
                    alt={selectedFile.name}
                  />
                )}

                {(selectedFile?.attachment?.[0]?.mimeType.startsWith('video/') ||
                  videoFormats.includes(selectedFile?.attachment?.[0]?.attachmentType || '')) && (
                  <Box component="div" sx={{ width: '100%', textAlign: 'center' }}>
                    <video controls autoPlay style={{ width: '100%' }}>
                      <source
                        src={fileUrls[selectedFile.id] || selectedFile?.attachment?.[0]?.url}
                        type={`video/${selectedFile?.attachment?.[0]?.attachmentType}`}
                      />
                      <track
                        kind="captions"
                        srcLang="en"
                        src={fileUrls[selectedFile.id] || selectedFile?.attachment?.[0]?.url}
                      />
                    </video>
                  </Box>
                )}

                {documentsFormats.includes(selectedFile?.attachment?.[0]?.attachmentType || '') && (
                  <Box component="div" sx={{ width: '100%', textAlign: 'center' }}>
                    <iframe
                      title={selectedFile.name}
                      src={fileUrls[selectedFile.id] || selectedFile?.attachment?.[0]?.url}
                      style={{ width: '100%', height: '600px' }}
                    />
                    <SC.Link
                      href={fileUrls[selectedFile.id] || selectedFile?.attachment?.[0]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {translate('Open file')}
                    </SC.Link>
                  </Box>
                )}

                {!(
                  selectedFile?.attachment?.[0]?.mimeType.startsWith('image/') ||
                  selectedFile?.attachment?.[0]?.mimeType.startsWith('video/') ||
                  videoFormats.includes(selectedFile?.attachment?.[0]?.attachmentType || '') ||
                  documentsFormats.includes(selectedFile?.attachment?.[0]?.attachmentType || '')
                ) && (
                  <Box component="div" p={2} textAlign="center">
                    <Typography variant="h6">Preview not available</Typography>
                    <SC.Link
                      href={fileUrls[selectedFile.id] || selectedFile?.attachment?.[0]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {translate('Open file')}
                    </SC.Link>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Dialog>
      </SC.Body>
    </SC.KanbanFileViewerStyled>
  );
};
