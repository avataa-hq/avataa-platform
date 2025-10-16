import { describe, it, expect } from 'vitest';
import { formatDate } from '../formatDate';

describe('formatDate', () => {
  it('should return null if dateString is undefined', () => {
    const result = formatDate(undefined);
    expect(result).toBeNull();
  });

  it('should format a valid date string with the default format', () => {
    const result = formatDate('2024-10-28');
    expect(result).toBe('28.10.2024');
  });

  it('should format a valid Date object with the specified format', () => {
    const date = new Date(2024, 9, 28, 14, 30, 45);
    const result = formatDate(date, 'dd.MM.yyyy HH:mm:ss');
    expect(result).toBe('28.10.2024 14:30:45');
  });

  it('should format a valid date string with the specified format', () => {
    const result = formatDate('2024-10-28T14:30:45', 'dd.MM.yyyy HH:mm:ss');
    expect(result).toBe('28.10.2024 14:30:45');
  });

  it('should handle an invalid date string by returning "Invalid Date"', () => {
    const result = formatDate('[object Object]');
    expect(result).toBe('Invalid Date');
  });

  it('should return null if dateString is an empty string', () => {
    const result = formatDate(' ');
    expect(result).toBeNull();
  });

  it('should return a valid date string if the dateString has leading/trailing spaces', () => {
    const result = formatDate('  2024-10-28  ');
    expect(result).toBe('28.10.2024');
  });
});
