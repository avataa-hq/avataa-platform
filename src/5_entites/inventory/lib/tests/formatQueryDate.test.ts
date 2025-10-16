import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { formatQueryDate } from '../formatQueryDate';

describe('formatQueryDate', () => {
  it('should format a valid date with a specified time', () => {
    const date = dayjs('2024-10-18');
    const time = dayjs('2024-10-18T14:30:45');
    const result = formatQueryDate(date, time);
    expect(result).toBe('2024-10-18T14:30:45');
  });

  it('should format a valid date with time set to 00:00:00 if time is null', () => {
    const date = dayjs('2024-10-18');
    const result = formatQueryDate(date, null);
    expect(result).toBe('2024-10-18T00:00:00');
  });

  it('should format a valid date with partial time (hour and minute set)', () => {
    const date = dayjs('2024-10-18');
    const time = dayjs('2024-10-18T14:30');
    const result = formatQueryDate(date, time);
    expect(result).toBe('2024-10-18T14:30:00');
  });

  it('should return undefined if date is null', () => {
    const result = formatQueryDate(null, dayjs('2024-10-18T14:30:45'));
    expect(result).toBeUndefined();
  });

  it('should return undefined if formatted date is invalid', () => {
    const result = formatQueryDate(dayjs('[object Object]'), dayjs('2024-10-18T14:30:45'));
    expect(result).toBeUndefined();
  });
});
