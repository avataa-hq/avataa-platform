import { AccordionProps, SxProps, Theme } from '@mui/material';
import { CSSProperties } from 'react';

export interface ILegendItem {
  id: string | number;
  name: string;
  icon?: React.ReactNode;
  geometry_type?: string | null;
  children?: ILegendItem[];
  props?: Omit<AccordionProps, 'children'>;
  visible?: boolean;
  [key: string]: any;
}

export interface LegendProps<T extends ILegendItem = ILegendItem> {
  data: T[];
  isLoading?: boolean;
  isInitiallyOpen?: boolean;
  getItemIcon?: (item: T) => React.ReactNode;
  title?: string;
  sx?: SxProps<Theme>;
  styles?: CSSProperties;
  handleCheckboxClick?: (newTmoId: number | string) => void;
}
