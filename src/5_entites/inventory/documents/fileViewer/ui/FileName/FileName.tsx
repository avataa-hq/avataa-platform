import { Tooltip, Typography } from '@mui/material';
import { cutTypeFromFileName, fileNameLengthConstraint } from '5_entites';

interface IProps {
  fileName: string;
  fileId?: string;
}

export const FileName = ({ fileName, fileId }: IProps) => {
  return (
    <Tooltip title={fileId || cutTypeFromFileName(fileName)}>
      <Typography component="h3" variant="body2">
        {fileNameLengthConstraint(fileName, fileId)}
      </Typography>
    </Tooltip>
  );
};
