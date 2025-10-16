import { SvgIconComponent } from '@mui/icons-material';

export interface ISwitchButtonsConfig {
  key: string;
  label: string;
  Icon: SvgIconComponent;
  dataTestId: string;
  permission?: boolean;
}
