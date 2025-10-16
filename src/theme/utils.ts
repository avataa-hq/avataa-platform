import { alpha, Theme, SvgIconProps, getContrastRatio } from '@mui/material';

export const getBubbleSvgIconStyle = (theme: Theme, { color }: SvgIconProps) => {
  let bubbleColor = theme.palette.neutralVariant.icon;

  if (color && color !== 'disabled' && color !== 'action' && color !== 'inherit') {
    bubbleColor =
      // @ts-expect-error I'm just too lazy to exclude the unnecessary colors. I wrote a fallback, so there will not be any problems.
      theme.palette[color]?.main ??
      // @ts-expect-error I'm just too lazy to exclude the unnecessary colors. I wrote a fallback, so there will not be any problems.
      theme.palette.common[color] ??
      theme.palette.neutralVariant.icon;
  }

  return {
    bubbleColor,
    style: {
      background: `radial-gradient(102.81% 102.81% at 50% 50%, ${bubbleColor} 0%, ${bubbleColor} 20%, ${alpha(
        bubbleColor,
        0.2,
      )} 100%)`,
      boxShadow: `0px 6px 20px 0px ${alpha(bubbleColor, 0.2)}`,
      color:
        getContrastRatio('#ffffff', bubbleColor) < 1
          ? theme.palette.getContrastText(bubbleColor)
          : 'white',
      overflow: 'visible',
      fill: 'currentColor',
    },
  };
};
