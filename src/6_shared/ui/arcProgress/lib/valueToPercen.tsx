const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

export const valueToPercent = (value: number, min: number, max: number): number => {
  if (min === max) return 0;
  const clamped = clamp(value, min, max);

  return ((clamped - min) / (max - min)) * 100;
};
