import { capitalize } from '6_shared';

export const transformData = (obj: Record<string, any>, exclusionList?: string[]) => {
  return Object.entries(obj).flatMap((item) => {
    if (exclusionList && exclusionList.includes(item[0])) return [];
    return { title: capitalize(item[0]), value: item[1] };
  });
};
