import dayjs from 'dayjs';

export const groupedDataByDate = <T extends { date: string }>(data: T[]) => {
  return data.reduce((acc, item) => {
    const date = dayjs(item.date).toISOString();
    acc.set(date, item);
    return acc;
  }, new Map<string, T>());
};
