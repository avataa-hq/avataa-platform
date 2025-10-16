import { IFileData, UpdateFileBody, capitalize } from '6_shared';
import { Box, CircularProgress, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useUpdateDocument } from '4_features';

interface IProps {
  document: IFileData;
  disabled?: boolean;
  setIsDeleteDocumentStatus?: (isDelete: boolean) => void;
}

export const FileStatus = ({ document, disabled, setIsDeleteDocumentStatus }: IProps) => {
  const statuses = ['created', 'reviewed', 'approved', 'published', 'archived', 'deleted'];

  const { updateDocumentFn, isUpdateDocumentLoading } = useUpdateDocument();

  const loading = isUpdateDocumentLoading;

  const onStatusChange = async (e: SelectChangeEvent) => {
    if (e.target.value.toLowerCase() !== document.status) {
      const body: UpdateFileBody = {
        id: document.id,
        body: { status: e.target.value.toLowerCase() },
      };
      if (e.target.value.toLowerCase() === 'deleted') {
        setIsDeleteDocumentStatus?.(true);
      } else {
        await updateDocumentFn(body);
      }
    }
  };

  return (
    <Select
      value={capitalize(document.status)}
      onChange={onStatusChange}
      sx={{
        height: '20px',
        paddingLeft: '10px',
      }}
      disabled={disabled}
      startAdornment={
        loading && (
          <Box component="div" sx={{ mr: 0.5 }}>
            <CircularProgress color="primary" size={10} />
          </Box>
        )
      }
    >
      {statuses.map((item) => (
        <MenuItem key={item} value={capitalize(item)}>
          {capitalize(item)}
        </MenuItem>
      ))}
    </Select>
  );
};
