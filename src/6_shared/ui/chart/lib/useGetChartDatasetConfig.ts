import { getColorFromGradient } from '6_shared/lib';

import { alpha, useTheme } from '@mui/material';

type ChartColor = 'primary' | 'error' | 'warning' | 'success';

interface GetChartDatasetConfigProps {
  color?: ChartColor;
  dashed?: boolean;
  curved?: boolean;
  hidePoints?: boolean;
}

export const useGetChartDatasetConfig = () => {
  const theme = useTheme();

  const colors: Record<string, Record<string, string>> = {
    primary: {
      lineBorderColor: theme.palette.primary.main,
      pointBackgroundColor: theme.palette.primary.main,
      pointBorderColor: alpha(theme.palette.primary.main, 0.1),
    },
    warning: {
      lineBorderColor: theme.palette.warning.main,
      pointBackgroundColor: theme.palette.warning.main,
      pointBorderColor: alpha(theme.palette.warning.main, 0.1),
    },
    error: {
      lineBorderColor: theme.palette.error.main,
      pointBackgroundColor: theme.palette.error.main,
      pointBorderColor: alpha(theme.palette.error.main, 0.1),
    },
    success: {
      lineBorderColor: theme.palette.success.main,
      pointBackgroundColor: theme.palette.success.main,
      pointBorderColor: alpha(theme.palette.success.main, 0.1),
    },
  };

  const getDatasetConfig = ({ color, curved, dashed, hidePoints }: GetChartDatasetConfigProps) => {
    return {
      ...(color && colors[color]),
      pointHoverBackgroundColor: theme.palette.warning.main,
      pointHoverBorderColor: alpha(theme.palette.warning.main, 0.1),
      ...(curved && { tension: 0.5 }),
      ...(curved === false && { tension: 0 }),
      ...(dashed && { borderDash: [15, 5] }),
      ...(dashed === false && { borderDash: [] }),
      ...(hidePoints && { pointRadius: 0 }),
    };
  };

  const colorConfigs = Object.values(colors);

  const getDatasetColorConfigFromGradient = (index: number, numberOfDatasets: number) => {
    const chartColors = theme.palette.components.chart.colors;
    const chartColor =
      numberOfDatasets > chartColors.length
        ? getColorFromGradient(index / numberOfDatasets, chartColors)
        : chartColors[index];

    return {
      lineBorderColor: chartColor,
      pointBackgroundColor: chartColor,
      pointBorderColor: `${chartColor}50`,
      pointHoverBackgroundColor: theme.palette.warning.main,
      pointHoverBorderColor: alpha(theme.palette.warning.main, 0.1),
    };
  };

  return { getDatasetConfig, colorConfigs, getDatasetColorConfigFromGradient };
};
