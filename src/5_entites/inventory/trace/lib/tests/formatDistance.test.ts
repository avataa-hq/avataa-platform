import { describe, it, expect } from 'vitest';
import { formatDistance } from '../formatDistance';

describe('formatDistance', () => {
  it('should return "0 km" when input is null', () => {
    expect(formatDistance(null)).toBe('0 km');
  });

  it('should return "0 km" when input is 0', () => {
    expect(formatDistance(0)).toBe('0 km');
  });

  it('should format a small distance with two decimal places', () => {
    expect(formatDistance(500)).toBe('500.00 km');
  });

  it('should format a distance over 1000 meters with two decimal places', () => {
    expect(formatDistance(1500)).toBe('1500.00 km');
  });

  it('should handle large distances correctly', () => {
    expect(formatDistance(100000)).toBe('100000.00 km');
  });

  it('should round the distance to two decimal places', () => {
    expect(formatDistance(1234.5678)).toBe('1234.57 km');
  });
});
