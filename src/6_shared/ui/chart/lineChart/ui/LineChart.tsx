import { SxProps } from '@mui/system';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
  ChartData,
  ScatterDataPoint,
  ChartOptions,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { patchObject } from '6_shared/lib';
import { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { LineChartContainer } from './LineChart.styled';
import { useDefaultChartOptions, useGetChartDatasetConfig } from '../../lib';
import { rangeHighlightPlugin, setHighlightRange } from '../lib/rangeHighlightPlugin';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
  zoomPlugin,
  rangeHighlightPlugin,
);

interface DatasetConfig {
  [key: string]: any;
}

interface LineChartProps {
  data: ChartData<'line', (number | ScatterDataPoint | null)[], unknown>;
  options?: ChartOptions<'line'>;
  sx?: SxProps;
  disabledLegend?: boolean;
  multipleColors?: boolean;
  handleSelectedRangeChange?: (range: { start: string; end: string } | null) => void;
  selectedRanges?: { start: string; end: string }[];
}

export const LineChart = ({
  data: { labels, datasets },
  options = {},
  sx,
  disabledLegend,
  multipleColors = false,
  handleSelectedRangeChange,
  selectedRanges,
}: LineChartProps) => {
  const {
    elements: { line, point },
    scales,
    plugins,
  } = useDefaultChartOptions();
  const { colorConfigs, getDatasetColorConfigFromGradient } = useGetChartDatasetConfig();
  const lineRef = useRef<any | null>(null);

  const [isContextMenuClicked, setIsContextMenuClicked] = useState(false);
  const [zoomRange, setZoomRange] = useState<{ start: string; end: string } | null>(null);

  useEffect(() => {
    if (selectedRanges) {
      setHighlightRange(selectedRanges);
    }
  }, [selectedRanges]);

  useEffect(() => {
    if (!zoomRange) return () => {};
    const timeout = setTimeout(() => {
      handleSelectedRangeChange?.(zoomRange);
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, [zoomRange]);

  const defaultOptions: ChartOptions<'line'> = useMemo(
    () => ({
      elements: {
        line,
        point,
      },
      scales: {
        x: scales.x,
        y: scales.y,
      },
      backgroundColor: 'transparent',
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        ...plugins,
        legend: { display: !disabledLegend },
        dragData: false,
        ...(handleSelectedRangeChange &&
          !isContextMenuClicked && {
            zoom: {
              zoom: {
                drag: {
                  enabled: true,
                  borderColor: 'rgba(255,99,132,0.3)',
                  borderWidth: 1,
                  backgroundColor: 'rgba(255,99,132,0.1)',
                  modifierKeys: ['ctrl'],
                },
                mode: 'x',
                onZoomComplete: ({ chart }) => {
                  const { min } = chart.scales.x;
                  const { max } = chart.scales.x;
                  const start = format(new Date(min), 'yyyy-MM-dd');
                  const end = format(new Date(max), 'yyyy-MM-dd');
                  setZoomRange({ start, end });
                },
              },
              pan: {
                enabled: false,
              },
            },
          }),
      },
    }),
    [
      disabledLegend,
      handleSelectedRangeChange,
      line,
      plugins,
      point,
      scales.x,
      scales.y,
      isContextMenuClicked,
    ],
  );

  const updatedOptions = useMemo(
    () => patchObject(defaultOptions, options),
    [options, defaultOptions],
  );

  const updatedData = useMemo(
    () => ({
      labels,
      datasets: datasets.map(({ label, data, ...config }, i, arr) => {
        const datasetConfig: DatasetConfig = multipleColors
          ? getDatasetColorConfigFromGradient(i, arr.length)
          : colorConfigs[i % colorConfigs.length];

        return {
          label,
          data,
          ...patchObject(datasetConfig, config),
        };
      }),
    }),
    [labels, datasets, multipleColors, getDatasetColorConfigFromGradient, colorConfigs],
  );
  // ...

  return (
    <LineChartContainer
      sx={sx}
      onContextMenu={(e) => {
        e.preventDefault();
        if (!e.ctrlKey) setIsContextMenuClicked(true);
      }}
      onMouseUp={() => {
        lineRef?.current?.resetZoom?.();
        setIsContextMenuClicked(false);
      }}
    >
      <Line ref={lineRef} options={updatedOptions} data={updatedData} />
    </LineChartContainer>
  );
};
