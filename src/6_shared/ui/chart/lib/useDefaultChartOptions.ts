import { alpha, useTheme } from '@mui/material';

export const useDefaultChartOptions = () => {
  const theme = useTheme();

  const lineColor = theme.palette.components.chart.primaryLine;

  const pointColor = theme.palette.components.chart.primaryLine;
  const pointColorHover = theme.palette.warning.main;

  const borderPointColor = theme.palette.components.chart.primaryLineSurface;
  const borderPointColorHover = alpha(theme.palette.warning.main, 0.1);
  const yAxisLabelColor = theme.palette.components.chart.labelColor;
  const xAxisLabelColor = theme.palette.text.primary;
  // eslint-disable-next-line prefer-destructuring
  const backgroundColor = theme.palette.components.chart.backgroundColor;
  // eslint-disable-next-line prefer-destructuring
  const labelBackdropColor = theme.palette.components.chart.labelBackdropColor;
  // eslint-disable-next-line prefer-destructuring
  const gridBorderColor = theme.palette.components.chart.gridBorderColor;
  // eslint-disable-next-line prefer-destructuring
  const gridColor = theme.palette.components.chart.gridColor;

  const elements = {
    line: {
      borderColor: lineColor,
      borderWidth: 2,
    },
    point: {
      backgroundColor: pointColor,
      radius: 4,
      borderWidth: 4,
      borderColor: borderPointColor,
      hoverRadius: 8,
      hoverBorderWidth: 10,
      hoverBackgroundColor: pointColorHover,
      hoverBorderColor: borderPointColorHover,
    },
  };

  const plugins = {
    legend: {
      labels: {
        color: xAxisLabelColor,
      },
    },
  };

  const scales = {
    r: {
      max: 10,
      min: 0,
      pointLabels: {
        color: xAxisLabelColor,
      },
      ticks: {
        color: xAxisLabelColor,
        backdropColor: labelBackdropColor,
      },
      angleLines: {
        color: gridColor,
      },
      grid: {
        color: gridColor,
      },
    },
    x: {
      grid: {
        display: false,
      },
      border: {
        color: gridBorderColor,
      },
      ticks: {
        color: xAxisLabelColor,
      },
    },
    y: {
      grid: {
        color: gridColor,
        drawTicks: false,
      },
      border: {
        display: false,
        dash: [2, 4],
      },
      ticks: {
        padding: 10,
        color: yAxisLabelColor,
      },
    },
  };

  return { elements, scales, backgroundColor, plugins };
};
