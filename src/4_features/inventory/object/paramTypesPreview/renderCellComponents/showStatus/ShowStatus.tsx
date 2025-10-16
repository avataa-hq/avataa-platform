import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import { Tooltip, useTheme } from '@mui/material';
import { StatusStyled } from './ShowStatus.styled';

interface IProps {
  value: 'OK' | 'ERROR';
}

export const ShowStatus = ({ value }: IProps) => {
  const theme = useTheme();

  const getColor = () => {
    switch (value) {
      case 'OK':
        return theme.palette.success.main;
      case 'ERROR':
        return theme.palette.error.main;
      default:
        return theme.palette.success.main;
    }
  };

  const color = getColor();
  return (
    <Tooltip
      title={
        value === 'ERROR'
          ? 'An error has occurred. Click for more information'
          : 'Param type is valid'
      }
      placement="right"
    >
      <StatusStyled color={color}>
        {value === 'OK' && <DoneIcon sx={{ color }} />}
        {value === 'ERROR' && <CancelIcon sx={{ color }} />}
        {value}
      </StatusStyled>
    </Tooltip>
  );
};
