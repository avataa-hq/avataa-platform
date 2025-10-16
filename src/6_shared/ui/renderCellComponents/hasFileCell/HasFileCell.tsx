import { Box } from '6_shared/ui/box';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface IProps {
  hasFiles: boolean;
}

export const HasFileCell = ({ hasFiles }: IProps) => {
  return <Box>{hasFiles ? <InsertDriveFileIcon /> : null}</Box>;
};
