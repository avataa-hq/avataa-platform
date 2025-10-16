import dayjs from 'dayjs';

/**
 * Format date for API
 * @param date Date (dayjs object)
 * @param options Format options
 * @returns Date string in the needed format or undefined
 */
export function formatDateForApi(
  date: dayjs.Dayjs | null | undefined,
  options?: {
    utc?: boolean;
    withTime?: boolean;
  },
): string | undefined {
  if (!date || !date.isValid()) return undefined;

  const { utc = false, withTime = false } = options || {};

  if (utc) {
    return date.toISOString();
  }

  if (withTime) {
    return date.format('YYYY-MM-DDTHH:mm:ss');
  }

  return date.format('YYYY-MM-DD');
}
