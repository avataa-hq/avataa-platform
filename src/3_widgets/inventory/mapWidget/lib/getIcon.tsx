import { IMuiIconsType } from 'components/MUIIconLibrary/MUIIconLibrary';
import * as Icons from '@mui/icons-material';

export const getIcon = (icon: IMuiIconsType | undefined | null, fill?: string) => {
  const Icon = Icons[icon || 'PlaceRounded'];
  return <Icon fontSize="large" sx={{ fill, width: '100%', height: '100%' }} />;
};
