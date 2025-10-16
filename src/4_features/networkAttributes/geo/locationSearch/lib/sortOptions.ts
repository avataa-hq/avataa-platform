import { IOption } from '../types';

const groupOrder = ['Objects', 'Parameters', 'Geographic'];

export const sortOptions = (a: IOption, b: IOption) => {
  const indexA = groupOrder.indexOf(a.group);
  const indexB = groupOrder.indexOf(b.group);

  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }
  if (indexA !== -1) {
    return -1;
  }
  if (indexB !== -1) {
    return 1;
  }

  return a.group.localeCompare(b.group);
};
