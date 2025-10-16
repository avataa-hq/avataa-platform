import dayjs from 'dayjs';

export const formatTitleDate = (dateString: string) => {
  const date = dayjs(dateString?.trim(), 'DD.MM.YYYY HH:mm:ss');

  if (!date.isValid()) {
    return 'Invalid Date';
  }

  const monthName = date.format('MMMM');

  const day = date.format('D');

  const time = date.format('HH:mm');

  return `${day} ${monthName} ${time}`;
};
