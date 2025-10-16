import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';

export const getLastDayDateRange = (dateRange: DateRange<Dayjs>): DateRange<Dayjs> => {
  const [, end] = dateRange;
  if (!end) {
    return [null, null];
  }

  return [end, end];
};
