import { ARC_FULL_END, ARC_FULL_START } from '../config';

export const percentToAngle = (percent: number) =>
  ARC_FULL_START + (ARC_FULL_END - ARC_FULL_START) * (percent / 100);

export const percentToAngleCircle = (percent: number) => {
  return (percent * 360) / 100 + 180;
};
