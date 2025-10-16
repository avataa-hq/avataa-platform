import * as Icons from '@mui/icons-material';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export const MuiIcons: Record<
  keyof typeof Icons,
  OverridableComponent<SvgIconTypeMap<{ variant?: 'bubble' }>> & {
    muiName: string;
  }
> = Icons;
