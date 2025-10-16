import { SvgIcon, SvgIconProps } from '@mui/material';

// import { ReactComponent as ChoiceIconSvg } from 'assets/icons/choice.svg';
import ChoiceIconSvg from 'assets/icons/choice.svg?react';

export const ChoiceIcon = (props: SvgIconProps) => (
  <SvgIcon component={ChoiceIconSvg} inheritViewBox {...props} />
);
