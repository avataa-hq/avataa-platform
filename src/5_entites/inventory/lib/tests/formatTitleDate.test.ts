import { describe, it, expect } from 'vitest';
import { formatTitleDate } from '../formatTitleDate';

describe('formatTitleDate', () => {
  it('should format a valid date string in "DD.MM.YYYY HH:mm:ss" format correctly', () => {
    const result = formatTitleDate('2024-10-18T14:30:38.919006');
    expect(result).toBe('18 October 14:30');
  });

  it('should format another valid date string correctly', () => {
    const result = formatTitleDate('2024-01-01T09:00:38.919006');
    expect(result).toBe('1 January 09:00');
  });

  it('should return "Invalid Date" for an invalid date string', () => {
    const result = formatTitleDate('[object Object]');
    expect(result).toBe('Invalid Date');
  });

  it('should return "Invalid Date" for an empty string', () => {
    const result = formatTitleDate('');
    expect(result).toBe('Invalid Date');
  });

  it('should return "Invalid Date" for a partial date string', () => {
    const result = formatTitleDate('18.10.2024');
    expect(result).toBe('Invalid Date');
  });

  it('should return a valid date string if the input has leading/trailing spaces', () => {
    const result = formatTitleDate('  2024-10-18T14:30:38.919006  ');
    expect(result).toBe('18 October 14:30');
  });
});
