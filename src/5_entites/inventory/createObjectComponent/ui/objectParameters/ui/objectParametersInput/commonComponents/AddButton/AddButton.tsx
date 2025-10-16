import { useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import * as SC from './AddButton.styled';

interface IProps {
  onClick: () => void;
}

export const AddButton = ({ onClick }: IProps) => {
  const theme = useTheme();

  return (
    <SC.AddButton onClick={onClick}>
      <AddIcon
        sx={{
          width: '15px',
          height: '15px',
          fill: theme.palette.primary.main,
        }}
      />
    </SC.AddButton>
  );
};
