import { Tooltip } from '@mui/material';
import * as Icons from '@mui/icons-material';

import { IMuiIconsType } from 'components/MUIIconLibrary/MUIIconLibrary';

export const renderIcon = (
  selectedIcon: IMuiIconsType | null | 'string',
  setIsIconsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (!selectedIcon || selectedIcon === 'string') return null;

  const MUIIcon = Icons[selectedIcon];
  return (
    <Tooltip title="Choose an icon" placement="top">
      <MUIIcon
        color="primary"
        sx={{ cursor: 'pointer' }}
        onClick={() => setIsIconsModalOpen(true)}
      />
    </Tooltip>
  );
};
