import {
  Add,
  AltRouteRounded,
  CircleRounded,
  FileDownloadOutlined,
  FilterAltRounded,
  Groups,
  JoinFullRounded,
  LensBlurRounded,
  ViewModuleRounded,
  Compare,
} from '@mui/icons-material';
import { SvgIconProps, SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import { OverridableComponent } from '@mui/types';

import { DataIcon } from '6_shared/ui/icons/DataIcon';
import { LineEndIcon } from '6_shared/ui/icons/LineEndIcon';
import { ObjectGroupIcon } from '6_shared/ui/icons/ObjectGroupIcon';
import { VariableIcon } from '6_shared/ui/icons/VariableIcon';
import { SplitIcon } from '6_shared/ui/icons/SplitIcon';
import { DataflowDiagramNodeType, Icons } from '6_shared';

const iconConfigs: Record<
  DataflowDiagramNodeType,
  {
    IconComponent:
      | (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
          muiName: string;
        })
      | ((props: SvgIconProps) => JSX.Element);
    iconColor: Omit<SvgIconProps['color'], 'inherit'>;
  }
> = {
  dmn: {
    iconColor: 'amaranthRed',
    IconComponent: ViewModuleRounded,
  },
  'dead-end': {
    iconColor: 'brilliantRose',
    IconComponent: LineEndIcon,
  },
  filter: {
    iconColor: 'saffronYellow',
    IconComponent: FilterAltRounded,
  },
  group: {
    iconColor: 'crustaOrange',
    IconComponent: ObjectGroupIcon,
  },
  join: {
    iconColor: 'royalBlue',
    IconComponent: JoinFullRounded,
  },
  source: {
    iconColor: 'jungleGreen',
    IconComponent: DataIcon,
  },
  extract: {
    iconColor: 'jungleGreen',
    IconComponent: DataIcon,
  },
  variable: {
    iconColor: 'lightDodgerBlue',
    IconComponent: VariableIcon,
  },
  split: {
    iconColor: 'brightGreen',
    IconComponent: SplitIcon,
  },
  branch: {
    iconColor: 'info',
    IconComponent: AltRouteRounded,
  },
  consume: {
    iconColor: 'dodgerBlue',
    IconComponent: Icons.CubeTreeIcon,
  },
  create: {
    iconColor: 'malachiteGreen',
    IconComponent: Add,
  },
  publish: {
    iconColor: 'flirtPurple',
    IconComponent: Groups,
  },
  load: {
    iconColor: 'denimBlue',
    IconComponent: FileDownloadOutlined,
  },
  trigger: {
    iconColor: 'javaBlue',
    IconComponent: Icons.TextSelectJumpIcon,
  },
  aggregate: {
    iconColor: 'blue',
    IconComponent: LensBlurRounded,
  },
  map: {
    iconColor: 'malachiteGreen',
    IconComponent: Compare,
  },
};

export const getRuleManagerIcon = (nodeType: DataflowDiagramNodeType) => {
  return iconConfigs[nodeType] ?? { iconColor: 'info', IconComponent: CircleRounded };
};
