import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { checkOnChangeDate } from '../checkOnChangeDate';

describe('checkOnChangeDate', () => {
  const maxDate = dayjs('12-31-2024');
  const minDate = dayjs('01-01-2020');

  it('should return null if year length is less than 4', () => {
    const value = dayjs('31-12-99');
    const result = checkOnChangeDate(value, maxDate, minDate);
    expect(result).toBeNull();
  });

  it('should return maxDate if year length is 4 and date is after maxDate', () => {
    const value = dayjs('01-01-2025');
    const result = checkOnChangeDate(value, maxDate, minDate);
    expect(result).toEqual(maxDate);
  });

  it('should return minDate if year length is 4 and date is before minDate', () => {
    const value = dayjs('01-01-1999');
    const result = checkOnChangeDate(value, maxDate, minDate);
    expect(result).toEqual(minDate);
  });

  it('should return the original value if year length is 4 and date is within the range', () => {
    const value = dayjs('01-01-2021');
    const result = checkOnChangeDate(value, maxDate, minDate);
    expect(result).toEqual(value);
  });

  it('should return null if value is null', () => {
    const result = checkOnChangeDate(null, maxDate, minDate);
    expect(result).toBeNull();
  });
});
