import { getGradient, LineChart, useGetChartDatasetConfig } from '6_shared';
import { ArrowDropDownRounded, ArrowDropUpRounded, CircleRounded } from '@mui/icons-material';
import { Box, Card, Typography, useTheme } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';

interface DataSourcesStatsProps {
  name: string;
  value: string | number;
  evolution: {
    value: string | number;
    period: string | number;
    type: 'increase' | 'decrease' | 'none';
  };
  color: 'primary' | 'success' | 'error' | 'warning';
  chartData: number[];
}

const statusIcons = {
  increase: ArrowDropUpRounded,
  decrease: ArrowDropDownRounded,
  none: CircleRounded,
};

export const DataSourcesStats = ({
  name,
  value,
  evolution,
  color,
  chartData,
}: DataSourcesStatsProps) => {
  const { getDatasetConfig } = useGetChartDatasetConfig();
  const theme = useTheme();

  const dataset1 = {
    fill: true,
    data: chartData,
    ...getDatasetConfig({ color }),
    backgroundColor(context: any, options: any): undefined | string {
      const { chart } = context;
      const { ctx, chartArea } = chart;

      if (!chartArea) {
        // This case happens on initial chart load
        return '';
      }
      return getGradient(ctx, chartArea, [
        `${theme.palette[color].main}00`,
        `${theme.palette[color].main}33`,
      ]);
    },
  };

  const EvolutionIcon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  } = statusIcons[evolution.type];

  return (
    <Card sx={{ borderRadius: '10px', flex: 1, overflow: 'hidden' }}>
      <Box
        component="div"
        maxWidth="430px"
        display="flex"
        overflow="hidden"
        gap="0.625rem"
        height="100%"
      >
        <Box
          component="div"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          gap="5px"
          height="fit-content"
        >
          <Typography sx={{ fontSize: '1rem', lineHeight: '1.25rem' }}>{name}</Typography>
          <Typography sx={{ fontSize: '2.5rem', lineHeight: '3.125rem' }}>{value}</Typography>
          <Typography
            sx={{
              color: ({ palette }) => palette.neutralVariant.onSurfaceVariant50,
              fontSize: '0.75rem',
              lineHeight: '1.125rem',
              fontWeight: '400',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: '1rem',
                lineHeight: '1.25rem',
                color: ({ palette }) => `${palette[color].main}`,
                fontWeight: '600',
              }}
            >
              {evolution.value}
            </Box>
            <EvolutionIcon
              sx={{
                color: ({ palette }) => `${palette[color].main}`,
                height: 'auto',
                width: evolution.type === 'none' ? '1.25rem' : '1.75rem',
                ...(evolution.type === 'none' && { padding: '0.25rem' }),
              }}
            />
            {evolution.period}
          </Typography>
        </Box>
        <LineChart
          sx={{ flex: 1 }}
          data={{
            labels: chartData.map((d, i) => i.toString()),
            datasets: [dataset1],
          }}
          options={{
            elements: {
              line: { tension: 0.5, borderWidth: 1.5 },
              point: { radius: 0 },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </Box>
    </Card>
  );
};
