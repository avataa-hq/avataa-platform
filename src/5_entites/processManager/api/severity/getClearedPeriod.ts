import { Interval, Period } from '6_shared';

export const getClearedPeriod = (period: Period, clearedInterval: Interval) => {
  let filters = [];
  if (period.selected) {
    filters = [
      {
        operator: 'inPeriod',
        value: String(period.value),
      },
    ];
  } else {
    if (clearedInterval.from) {
      filters.push({
        operator: 'moreOrEq',
        value: clearedInterval.from,
      });
    }
    if (clearedInterval.to) {
      filters.push({
        operator: 'less',
        value: clearedInterval.to,
      });
    }
  }

  return filters;
};
