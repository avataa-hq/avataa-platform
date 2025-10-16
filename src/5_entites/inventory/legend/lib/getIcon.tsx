import { IMuiIconsType } from 'components/MUIIconLibrary/MUIIconLibrary';
import * as Icons from '@mui/icons-material';

export const getIcon = (icon: IMuiIconsType | undefined | null) => {
  if (icon && !(icon in Icons)) return null;
  const iconKey: keyof typeof Icons = icon || 'PlaceRounded';
  const Icon = Icons[iconKey];
  return <Icon fontSize="small" sx={{ fill: 'white', width: '100%', height: '100%' }} />;
};
