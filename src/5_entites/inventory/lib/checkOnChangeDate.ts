import dayjs from 'dayjs';

export const checkOnChangeDate = (
  value: dayjs.Dayjs | null,
  maxDate: dayjs.Dayjs,
  minDate: dayjs.Dayjs,
) => {
  if (value) {
    const year = value.year().toString();

    if (year.length < 4) return null;

    if (year.length === 4 && value.isAfter(maxDate)) return maxDate;

    if (year.length === 4 && value.isBefore(minDate)) return minDate;
  }

  return value;
};
