import { useCallback } from 'react';
import { ComboConfig, GraphOptions, registerCombo } from '@antv/g6';
import { alpha } from '@mui/system';
import { useTheme } from '@mui/material';
import { CUSTOM_COMBO_TYPE } from '6_shared';
import { getComboAnchorPoints } from '../lib';

export const useGetDefaultComboBuild = () => {
  const { palette, typography } = useTheme();
  return useCallback((): GraphOptions['defaultCombo'] => {
    registerCombo(
      CUSTOM_COMBO_TYPE,
      {
        afterDraw: (cfg: Partial<ComboConfig> | undefined, group) => {
          const comboShape = group?.get('children')[0];
          const comboText = group?.get('children')[1];

          if (cfg) {
            const anchorPoints = getComboAnchorPoints(cfg.style?.r ?? 264);
            cfg.anchorPoints = anchorPoints;
          }

          if ((cfg?.children?.length ?? 0) <= 1) {
            comboShape?.destroy();
            comboText?.destroy();
          }
        },
      },
      'circle',
    );

    return {
      type: CUSTOM_COMBO_TYPE,
      style: {
        fill: alpha(palette.primary.main, 0.2),
        size: 0,
        stroke: alpha(palette.primary.main, 0.8),
        lineDash: [3, 5],
      },
      labelCfg: {
        refY: 10,
        style: {
          fill: palette.text.primary,
          fontSize: 16,
          fontWeight: typography.fontWeightBold,
          fontFamily: typography.fontFamily,
        },
      },
    };
  }, []);
};
