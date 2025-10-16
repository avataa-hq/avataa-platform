import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface IProps {
  onClick: () => void;
}
export const DeleteButton = ({ onClick }: IProps) => {
  return (
    <IconButton onClick={onClick}>
      <DeleteIcon
        sx={{
          width: '20px',
          height: '20px',
        }}
      />
    </IconButton>
  );
};
