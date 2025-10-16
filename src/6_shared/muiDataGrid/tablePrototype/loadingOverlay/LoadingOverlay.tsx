import { dotWave } from 'ldrs';
import { useTheme } from '@mui/material';
import { Loader } from '../DataGridPrototype.styled';

dotWave.register();

export const LoadingOverlay = () => {
  const theme = useTheme();
  return (
    <Loader>
      <l-dot-wave size="200" speed="1" color={theme.palette.primary.main} />
    </Loader>
  );
};
