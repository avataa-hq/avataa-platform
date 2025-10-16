import { format } from 'date-fns';

type DateFormat = 'dd.MM.yyyy' | 'dd.MM.yyyy HH:mm:ss';

export const formatDate = (
  dateString: Date | string | undefined,
  dateFormat: DateFormat = 'dd.MM.yyyy',
) => {
  if (!dateString || (typeof dateString === 'string' && dateString.trim() === '')) return null;

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const formattedDate = format(date, dateFormat);

  return formattedDate;
};
