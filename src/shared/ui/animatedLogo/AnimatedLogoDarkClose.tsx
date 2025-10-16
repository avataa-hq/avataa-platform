import AnimatedLogoCloseStyle from './AnimatedLogoCloseStyle';
import logo from './logotypeDarkClose/logoDarkClose.svg';
import aClose from './logotypeDarkClose/aDarkClose.svg';

export const AnimatedLogoDarkClose: React.FC = () => (
  <AnimatedLogoCloseStyle>
    <img className="logo-close" src={logo} alt="logo" />
    <img className="a-close" src={aClose} alt="a" />
  </AnimatedLogoCloseStyle>
);
