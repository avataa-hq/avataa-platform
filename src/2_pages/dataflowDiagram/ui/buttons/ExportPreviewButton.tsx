import { Button } from '@mui/material';
import { sourcesManagementApi, useTranslate } from '6_shared';
import { enqueueSnackbar } from 'notistack';

interface IProps {
  sourceId: number | null;
}

export const ExportPreviewButton = ({ sourceId }: IProps) => {
  const { useLazyExportSourcePreviewQuery } = sourcesManagementApi;
  const translate = useTranslate();
  const [exportSourcePreview, { isLoading: isExportSourcePreviewLoading }] =
    useLazyExportSourcePreviewQuery();

  const onExportFullPreviewClick = async () => {
    if (sourceId) {
      try {
        const response = await exportSourcePreview({ sourceId, fileType: 'xlsx' }).unwrap();

        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'Full data preview.xlsx';
        document.body.appendChild(a);
        a.click();

        enqueueSnackbar(translate('Data preview exported successfully'), { variant: 'success' });

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        throw new Error(error);
      }
    }
  };

  return (
    <Button
      variant="contained"
      onClick={onExportFullPreviewClick}
      disabled={isExportSourcePreviewLoading}
    >
      {isExportSourcePreviewLoading
        ? `${translate('Exporting')}...`
        : translate('Export full preview')}
    </Button>
  );
};
