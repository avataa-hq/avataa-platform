import { getContrastRatio, useTheme } from '@mui/material';
import AnimatedLogoCloseStyle from './AnimatedLogoCloseStyle';
import logo from './logotypeLightClose/logoLightClose.svg';
import aClose from './logotypeLightClose/aLightClose.svg';
import aCloseDark from './logotypeLightClose/aLightClose dark.svg';

export const AnimatedLogoLightClose: React.FC = () => {
  const theme = useTheme();

  const isBackgroundLight =
    getContrastRatio('#fff', theme.palette.components.sidebar.background) < 7;

  return (
    <AnimatedLogoCloseStyle>
      <img className="logo-close" src={logo} alt="logo" />
      <img className="a-close" src={isBackgroundLight ? aCloseDark : aClose} alt="a" />
    </AnimatedLogoCloseStyle>
  );
};
