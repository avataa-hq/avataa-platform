import AnimatedLogoStyle from './AnimatedLogoOpenStyle';
import a1 from './logotypeDarkOpen/1.svg';
import v2 from './logotypeDarkOpen/2.svg';
import a3 from './logotypeDarkOpen/3.svg';
import t4 from './logotypeDarkOpen/4.svg';
import a5 from './logotypeDarkOpen/5.svg';
import a6 from './logotypeDarkOpen/6.svg';
import l7 from './logotypeDarkOpen/7.svg';
import l8 from './logotypeDarkOpen/8.svg';

export const AnimatedLogoDarkOpen: React.FC = () => (
  <AnimatedLogoStyle>
    <img className="l7" src={l7} alt="_" />
    <img className="l8" src={l8} alt="_" />
    <img className="a1" src={a1} alt="a" />
    <img className="v2" src={v2} alt="v" />
    <img className="a3" src={a3} alt="a" />
    <img className="t4" src={t4} alt="t" />
    <img className="a5" src={a5} alt="a" />
    <img className="a6" src={a6} alt="a" />
  </AnimatedLogoStyle>
);
