import { useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';
import {
  getErrorMessage,
  ImportDelimiter,
  usePostBatchObjectsPreviewMutation,
  useTranslate,
} from '6_shared';
import { usePostBatchObjectsWithParametersMutation } from '6_shared/api/inventory/batchOperations/batchOperationsApi';

interface GetPreviewFileProps {
  columnNameMapping: Record<string, string>;
  objectTypeId: number;
  file: Blob;
  delimiter: ImportDelimiter;
  purpose: 'preview' | 'import';
  isForcedFileSend?: boolean;
}

export const useImportObjectsAndGetPreview = ({
  columnNameMapping,
  objectTypeId,
  file,
  delimiter,
  purpose,
  isForcedFileSend,
}: GetPreviewFileProps) => {
  const translate = useTranslate();
  const [postCsvFile] = usePostBatchObjectsWithParametersMutation();
  const [postFileForPreview] = usePostBatchObjectsPreviewMutation();

  const importObjectsAndGetPreview = useCallback(async () => {
    const formData = new FormData();
    formData.append('file', file, 'data.csv');
    if (purpose === 'import') {
      formData.append('check', 'false');
      formData.append('force', String(isForcedFileSend));
    }
    formData.append('delimiter', delimiter);
    formData.append('column_name_mapping', JSON.stringify(columnNameMapping));

    try {
      let response;
      if (purpose === 'import') {
        response = await postCsvFile({ id: objectTypeId, body: formData }).unwrap();

        enqueueSnackbar(translate('File is valid. Objects will be created soon.'), {
          variant: 'success',
        });
      } else {
        response = await postFileForPreview({ id: objectTypeId, body: formData }).unwrap();

        enqueueSnackbar(translate('Preliminary analysis data was successfully sent'), {
          variant: 'success',
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      throw error;
    }
  }, [
    columnNameMapping,
    delimiter,
    file,
    objectTypeId,
    postCsvFile,
    postFileForPreview,
    purpose,
    translate,
    isForcedFileSend,
  ]);

  return { importObjectsAndGetPreview };
};
