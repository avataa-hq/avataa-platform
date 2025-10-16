import { IconButton, useTheme } from '@mui/material';
import { alpha } from '@mui/system';
import { LaunchRounded } from '@mui/icons-material';

interface IProps {
  onClick?: () => void;
}

export const IconButtonStyled = ({ onClick }: IProps) => {
  const theme = useTheme();
  return (
    <IconButton
      onClick={onClick}
      sx={{
        backgroundColor: alpha(theme.palette.secondary.main, 0.2),
        '&:hover': { backgroundColor: alpha(theme.palette.secondary.main, 0.3) },
        transition: 'all 0.3s ease',
      }}
    >
      <LaunchRounded sx={{ fill: alpha(theme.palette.text.primary, 0.5) }} />
    </IconButton>
  );
};
