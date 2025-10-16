import { IColorRangeModel } from '6_shared';

export const filterColorRanges = (array: IColorRangeModel[]) => {
  const privateAndDefault = array.find((i) => i.default && !i.public);
  if (privateAndDefault) return privateAndDefault;
  const publicAndDefault = array.find((i) => i.default && i.public);
  if (publicAndDefault) return publicAndDefault;
  return array[0];
};
