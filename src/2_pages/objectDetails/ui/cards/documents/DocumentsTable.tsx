import { Box, Typography } from '@mui/material';

import { useGetDocumentsById } from '5_entites';
import { IFileData, Table, useTranslate } from '6_shared';

import { useGetDocumentsTableColumns } from '../../../lib/useGetDocumentsTableColumns';

interface DocumentsTableProps {
  objectId: number;
  filter?: (file: IFileData['attachment'][number]) => boolean;
}

export const DocumentsTable = ({ objectId, filter }: DocumentsTableProps) => {
  const translate = useTranslate();
  const { data, isFetching: isFetchingFileData } = useGetDocumentsById({
    objectId: objectId!,
    skip: objectId === null || objectId === undefined,
  });

  const columns = useGetDocumentsTableColumns();
  const files = data?.map((document) => document.attachment).flat();

  if (!files?.length)
    return (
      <Box
        component="div"
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography>{translate('There are no files')}</Typography>
      </Box>
    );

  return (
    <Table
      isLoading={isFetchingFileData}
      tableData={filter ? files?.filter(filter) : files}
      columns={columns}
    />
  );
};
