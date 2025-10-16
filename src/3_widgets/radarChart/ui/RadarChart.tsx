import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { RadarChartKPIType } from '../model';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface IProps {
  radarChartData: RadarChartKPIType;
}
export const RadarChart = ({ radarChartData }: IProps) => {
  const labels = Object.keys(radarChartData);
  const dataValues = labels.map((label) => radarChartData[label].percent);

  const data = {
    labels,
    datasets: [
      {
        label: 'KPI Performance',
        data: dataValues,
        borderWidth: 2,
        borderColor: 'rgba(50, 205, 50, 0.8)',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        pointBackgroundColor: (ctx: any) => {
          const color = Object.values(radarChartData ?? {})?.[ctx.dataIndex]?.color ?? 'red';
          return color;
        },
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBorderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = radarChartData[tooltipItem.label];
            return [`Value: ${value.realVal ?? value.value}`, `Max: ${value.realMax ?? value.max}`];
          },
        },
        displayColors: false,
      },
    },
    interaction: { mode: 'nearest' as 'nearest', axis: 'r' as 'r' },
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2, display: false },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        angleLines: { color: 'rgba(0, 0, 0, 0.2)' },
      },
    },
    elements: {
      line: { borderWidth: 2, borderColor: 'rgba(0, 128, 0, 0.7)', tension: 0.4 },
      point: {
        radius: 3,
        borderWidth: 0,
        borderColor: 'rgba(0, 0, 0, 0)',
        backgroundColor: (ctx: any) => {
          const colors = ['red', 'yellow', 'green'];
          return colors[ctx.dataIndex % colors.length];
        },
      },
    },
  };

  return <Radar data={data} options={options} />;
};
