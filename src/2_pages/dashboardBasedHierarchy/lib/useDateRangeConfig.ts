import { PickersShortcutsItem } from '@mui/x-date-pickers';
import { DateRange } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

const today = dayjs();

interface IProps {
  dataMaxDate?: string | null;
}

export const useDateRangeConfig = ({ dataMaxDate }: IProps) => {
  const getTimeRightBorder = () => {
    if (!dataMaxDate) return today;
    return dayjs(dataMaxDate);
  };

  const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
    {
      label: 'Current Week',
      getValue: () => {
        return [today.startOf('isoWeek'), getTimeRightBorder()];
      },
    },
    {
      label: 'Current Month',
      getValue: () => {
        return [today.startOf('month'), getTimeRightBorder()];
      },
    },
    {
      label: 'Current Quarter',
      getValue: () => {
        return [today.startOf('quarter'), getTimeRightBorder()];
      },
    },
    {
      label: 'Current Year',
      getValue: () => {
        return [today.startOf('year'), getTimeRightBorder()];
      },
    },
    { label: 'Reset', getValue: () => [null, null] },
  ];

  return { shortcutsItems };
};
