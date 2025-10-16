import { useTheme } from '@mui/material';
import { SVGAttributes, useMemo } from 'react';

export const useLinkStyleMap = () => {
  const theme = useTheme();

  const linkTypeStyleMap: Record<
    string,
    Omit<SVGAttributes<SVGPathElement>, 'strokeDasharray' | 'strokeWidth'> & {
      strokeDasharray?: number[];
      strokeWidth?: number;
    }
  > = useMemo(
    () => ({
      p_id: {
        stroke: theme.palette.neutralVariant.onSurface,
        strokeWidth: 2,
      },
      mo_link: {
        stroke: theme.palette.text.primary,
        strokeWidth: 1,
      },
      point_a: {
        stroke: theme.palette.common.amaranthRed,
        strokeWidth: 2,
        strokeDasharray: [3, 5],
      },
      point_b: {
        stroke: theme.palette.common.jungleGreen,
        strokeWidth: 2,
        strokeDasharray: [3, 5],
      },
      collapsed: {
        stroke: theme.palette.text.primary,
        strokeWidth: 1,
      },
      'line-node': {
        stroke: theme.palette.primary.main,
        strokeWidth: 2,
      },
      geometry_line: {
        stroke: theme.palette.text.primary,
        strokeWidth: 2,
        strokeDasharray: [3, 5],
      },
      default: {
        stroke: theme.palette.text.primary,
        strokeWidth: 1,
      },
    }),
    [
      theme.palette.common.amaranthRed,
      theme.palette.common.jungleGreen,
      theme.palette.neutralVariant.onSurface,
      theme.palette.primary.main,
      theme.palette.text.primary,
    ],
  );

  return linkTypeStyleMap;
};
