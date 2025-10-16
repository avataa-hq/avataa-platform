const granularityToField: Record<string, string> = {
  hour: 'hour_start',
  day: 'day_start',
  week: 'week_start',
  month: 'month_start',
  year: 'year_start',
};

export const getTimeField = (granularity?: string) =>
  granularityToField[granularity ?? 'month'] ?? 'month_start';
