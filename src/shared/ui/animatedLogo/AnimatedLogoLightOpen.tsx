import { getContrastRatio, useTheme } from '@mui/material';
import AnimatedLogoStyle from './AnimatedLogoOpenStyle';
import a1 from './logotypeLightOpen/1.svg';
import v2 from './logotypeLightOpen/2.svg';
import a3 from './logotypeLightOpen/3.svg';
import t4 from './logotypeLightOpen/4.svg';
import a5 from './logotypeLightOpen/5.svg';
import a6 from './logotypeLightOpen/6.svg';
import l7 from './logotypeLightOpen/7.svg';
import l8 from './logotypeLightOpen/8.svg';

import a1Dark from './logotypeLightOpen/1 dark.svg';
import v2Dark from './logotypeLightOpen/2 dark.svg';
import a3Dark from './logotypeLightOpen/3 dark.svg';
import t4Dark from './logotypeLightOpen/4 dark.svg';
import a5Dark from './logotypeLightOpen/5 dark.svg';
import a6Dark from './logotypeLightOpen/6 dark.svg';

export const AnimatedLogoLightOpen: React.FC = () => {
  const theme = useTheme();

  const isBackgroundLight =
    getContrastRatio('#fff', theme.palette.components.sidebar.background) < 7;

  return (
    <AnimatedLogoStyle>
      <img className="l7" src={l7} alt="_" />
      <img className="l8" src={l8} alt="_" />
      <img className="a1" src={isBackgroundLight ? a1Dark : a1} alt="a" />
      <img className="v2" src={isBackgroundLight ? v2Dark : v2} alt="v" />
      <img className="a3" src={isBackgroundLight ? a3Dark : a3} alt="a" />
      <img className="t4" src={isBackgroundLight ? t4Dark : t4} alt="t" />
      <img className="a5" src={isBackgroundLight ? a5Dark : a5} alt="a" />
      <img className="a6" src={isBackgroundLight ? a6Dark : a6} alt="a" />
    </AnimatedLogoStyle>
  );
};
