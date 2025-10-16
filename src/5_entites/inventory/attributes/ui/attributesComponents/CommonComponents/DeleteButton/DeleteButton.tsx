import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface IProps {
  onClick: () => void;
}

export const DeleteButton = ({ onClick }: IProps) => {
  return (
    <IconButton onClick={onClick} sx={{ width: '40px', height: '40px' }}>
      <CloseIcon />
    </IconButton>
  );
};
