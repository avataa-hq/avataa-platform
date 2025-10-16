import { PopulatedLink } from '../model';

export const getLinkIconAngle = ({ source, target }: PopulatedLink) => {
  const distance = {
    x: Math.abs(target.x - source.x),
    y: Math.abs(target.y - source.y),
  };

  const direction = {
    x: Math.sign(target.x - source.x),
    y: Math.sign(target.y - source.y),
  };

  if (distance.y > distance.x) {
    return 90 * direction.y;
  }
  if (direction.x < 0) {
    return 180;
  }
  return 0;
};
