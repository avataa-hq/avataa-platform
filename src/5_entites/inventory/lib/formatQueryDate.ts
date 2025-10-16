import dayjs from 'dayjs';

export const formatQueryDate = (date: dayjs.Dayjs | null, time: dayjs.Dayjs | null) => {
  if (!date) return undefined;

  const newDate = dayjs(date)
    .set('hour', time?.hour() ?? 0)
    .set('minute', time?.minute() ?? 0)
    .set('second', time?.second() ?? 0)
    .format('YYYY-MM-DDTHH:mm:ss');

  if (newDate === 'Invalid Date') return undefined;

  return newDate;
};
