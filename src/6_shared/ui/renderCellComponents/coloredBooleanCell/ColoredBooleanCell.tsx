import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { Circle } from './ColoredBooleanCell.styled';

interface IProps {
  value: boolean | 0 | 1 | string;
}

export const ColoredBooleanCell = ({ value }: IProps) => {
  const theme = useTheme();

  if (
    value != null &&
    (value === false || value.toString().toLowerCase() === 'false' || value === 0)
  ) {
    return (
      <Circle color={theme.palette.error.main}>
        <CloseIcon sx={{ fontSize: '14px', color: theme.palette.common.white }} />
      </Circle>
    );
  }

  if (
    value != null &&
    (value === true || value.toString().toLowerCase() === 'true' || value === 1)
  ) {
    return (
      <Circle color={theme.palette.success.main}>
        <CheckIcon sx={{ fontSize: '14px', color: theme.palette.common.white }} />
      </Circle>
    );
  }

  return null;
};
