interface IProps {
  index: number;
  values: number[];
}

export const firstValueRounder = ({ values, index }: IProps) => {
  const value = values[index - 1];
  const sign = Math.sign(value);
  const absValue = Math.abs(value);

  if (absValue > 1000000) {
    return (Math.round(absValue / 100000) / 10) * sign;
  }
  if (absValue > 1000 && absValue < 1000000) {
    return (Math.round(absValue / 100) / 10) * sign;
  }
  return (Math.round(absValue * 10) / 10) * sign;
};

export const secondValueRounder = ({ values, index }: IProps) => {
  const value = values[index];
  const sign = Math.sign(value);
  const absValue = Math.abs(value);

  if (absValue > 1000000) {
    return (Math.round(absValue / 100000) / 10) * sign;
  }
  if (absValue > 1000 && absValue < 1000000) {
    return (Math.round(absValue / 100) / 10) * sign;
  }
  return (Math.round(absValue * 10) / 10) * sign;
};

export const sliderValueRounder = (value: number) => {
  const sign = Math.sign(value);
  const absValue = Math.abs(value);

  if (absValue >= 1e18) {
    return `${(Math.round(absValue / 1e17) / 10) * sign}E`;
  }
  if (absValue >= 1e15) {
    return `${(Math.round(absValue / 1e14) / 10) * sign}P`;
  }
  if (absValue >= 1e12) {
    return `${(Math.round(absValue / 1e11) / 10) * sign}T`;
  }
  if (absValue >= 1e9) {
    return `${(Math.round(absValue / 1e8) / 10) * sign}G`;
  }
  if (absValue >= 1e6) {
    return `${(Math.round(absValue / 1e5) / 10) * sign}M`;
  }
  if (absValue >= 1e3 && absValue < 1e6) {
    return `${(Math.round(absValue / 1e2) / 10) * sign}K`;
  }
  return (Math.round(absValue * 10) / 10) * sign;
};

export const valueDimensioner = ({ values, index }: IProps) => {
  const absValue = Math.abs(values[index]);

  if (absValue > 1000000) {
    return 'millions';
  }
  if (absValue > 1000 && absValue < 1000000) {
    return 'thousand';
  }
  return 'units';
};
