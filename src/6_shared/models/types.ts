import { IColoredLineData } from '6_shared/ui';
import { IArcProgressData } from '6_shared/ui/arcProgress/types';

interface ITopViewDashboardColoredLineData {
  title: string;
  data: IColoredLineData[];
}

export interface ITopViewDashboardIndicatorData {
  title: string;
  progressData: IArcProgressData;
  coloredLineData: ITopViewDashboardColoredLineData;
  nestedData?: ITopViewDashboardIndicatorData[];
  imageUrl?: string | null;
}

export interface ICalculateForCurrentPeriodData {
  date: string;
  value: number;
}
