import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '@emotion/react';
import type { IRow } from './EventsRow';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const calculateStressValues = (
  relaxationPeriod: number,
  alpha: number,
  beta: number,
  eventValue: number,
  weight: number,
) => {
  const dataPoints = [];

  for (let day = 0; day <= relaxationPeriod; day++) {
    const decay = (1 - day / relaxationPeriod) ** (alpha / beta);
    const stressValue = eventValue * weight * decay;
    dataPoints.push({ day, stressValue });
  }

  return dataPoints;
};

interface IProps {
  row: IRow;
}

export const FormulaChart = ({ row }: IProps) => {
  const theme = useTheme();

  const relaxationPeriod = parseInt(row.data.relaxation_period.replace('d', ''), 10);
  const [alpha, beta] = row.data.relaxation_function.split('/').map((val) => parseFloat(val));
  const weight = parseFloat(row.data.weight.toString());

  const dataPoints = calculateStressValues(relaxationPeriod, alpha, beta, 1, weight);

  const days = dataPoints.map((point) => point.day);
  const stressValues = dataPoints.map((point) => point.stressValue);

  const data = {
    labels: days,
    datasets: [
      {
        label: 'Stress Value',
        data: stressValues,
        borderColor: theme.palette.components.chart.ml.borderColor1,
        backgroundColor: theme.palette.components.chart.ml.background,
        fill: true,
        tension: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.primary,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.primary,
        },
        grid: {
          color: theme.palette.divider,
          borderColor: theme.palette.divider,
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.primary,
        },
        grid: {
          color: theme.palette.divider,
          borderColor: theme.palette.divider,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};
