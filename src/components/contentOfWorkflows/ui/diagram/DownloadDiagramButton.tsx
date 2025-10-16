import { Link, Tooltip } from '@mui/material';
import { DownloadRounded } from '@mui/icons-material';

import { useTranslate } from '6_shared';
import { useGetBpmnDiagramFile } from 'components/contentOfWorkflows/lib';
import { enqueueSnackbar } from 'notistack';

export const DownloadDiagramButton = () => {
  const translate = useTranslate();
  const getBpmnDiagramFile = useGetBpmnDiagramFile();

  const downloadDiagram = async (event: any) => {
    const file = await getBpmnDiagramFile();
    if (!file) {
      enqueueSnackbar({
        variant: 'error',
        message: translate('An error occured: .bpmn file is missing'),
      });
      return;
    }

    const url = window.URL.createObjectURL(file);
    event.target.setAttribute('href', url);
    event.target.setAttribute('download', file.name);
  };

  return (
    <Tooltip title="Download BPMN file">
      {/* This anchor element will have dinamically set `href` attribute via `downloadDiagram` function, so it will be valid */}
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link
        sx={{
          textDecoration: 'none',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={downloadDiagram}
      >
        <DownloadRounded
          sx={{
            pointerEvents: 'none',
          }}
        />
      </Link>
    </Tooltip>
  );
};
