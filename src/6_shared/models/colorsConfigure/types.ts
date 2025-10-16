export type Color = {
  name: string;
  id: string | number;
  hex: string;
  booleanValue?: boolean;
  warningSignal?: boolean;
  lineWidth?: number;
};

export type Ranges = {
  colors: Color[];
  values?: number[];
};
