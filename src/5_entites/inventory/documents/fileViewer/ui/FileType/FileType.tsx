import { Typography } from '@mui/material';

interface IProps {
  fileType: string;
}

export const FileType = ({ fileType }: IProps) => {
  return <Typography variant="body2">{fileType}</Typography>;
};
