import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { transformValue } from '../transformValue';

describe('transformValue', () => {
  it('should format an array of dates correctly', () => {
    const result = transformValue({ value: ['2024-10-18', '2024-10-19'], valType: 'date' });
    expect(result).toBe('18-10-2024, 19-10-2024');
  });

  it('should format a single date correctly', () => {
    const result = transformValue({ value: '2024-10-18', valType: 'date' });
    expect(result).toBe('18-10-2024');
  });

  it('should format an array of datetimes correctly', () => {
    const result = transformValue({
      value: ['2024-10-18T14:30:45.123456Z', '2024-10-19T14:30:45.123456Z'],
      valType: 'datetime',
    });
    expect(result).toBe('18-10-2024 17:30:45, 19-10-2024 17:30:45');
  });

  it('should format an array of datetimes with timezone correctly', () => {
    const result = transformValue({
      value: ['2024-10-18T14:30:45.123456Z', '2024-10-19T14:30:45.123456Z'],
      valType: 'datetime',
      disableTimezoneAdjustment: true,
    });
    expect(result).toBe('18-10-2024 14:30:45, 19-10-2024 14:30:45');
  });

  it('should format a datetime with timezone correctly', () => {
    const result = transformValue({ value: '2024-10-18T14:30:45.123456Z', valType: 'datetime' });
    expect(result).toBe('18-10-2024 17:30:45');
  });

  it('should format a datetime without timezone correctly', () => {
    const result = transformValue({
      value: '2024-10-18T14:30:45.123456',
      valType: 'datetime',
      disableTimezoneAdjustment: true,
    });
    expect(result).toBe('18-10-2024 14:30:45');
  });

  it('should format a number as a string without valType', () => {
    const result = transformValue({ value: 123 });
    expect(result).toBe('123');
  });

  it('should format a number as a string with valType', () => {
    const result = transformValue({ value: 123.45, valType: 'number' });
    expect(result).toBe('123.45');
  });

  it('should return "True" for boolean true with valType boolean', () => {
    const result = transformValue({ value: true, valType: 'boolean' });
    expect(result).toBe('True');
  });

  it('should return "True" for boolean true without valType boolean', () => {
    const result = transformValue({ value: true });
    expect(result).toBe('True');
  });

  it('should return "False" for boolean false with valType boolean', () => {
    const result = transformValue({ value: false, valType: 'boolean' });
    expect(result).toBe('False');
  });

  it('should return "False" for boolean false without valType boolean', () => {
    const result = transformValue({ value: false });
    expect(result).toBe('False');
  });

  it('should return "null" for null value', () => {
    const result = transformValue({ value: null });
    expect(result).toBe('null');
  });

  it('should return "undefined" for undefined value', () => {
    const result = transformValue({ value: undefined });
    expect(result).toBe('undefined');
  });

  it('should return "_blank" for an empty string', () => {
    const result = transformValue({ value: ' ' });
    expect(result).toBe('_blank');
  });

  it('should join and crop an array of strings if crop is enabled', () => {
    const result = transformValue({
      value: ['One', 'Two', 'Three', 'Four'],
      valType: 'str',
      crop: true,
      cropLength: 10,
    });
    expect(result).toBe('One, Two, ...');
  });

  it('should crop a long string if crop is enabled', () => {
    const result = transformValue({
      value: 'This is a very long string that needs to be cropped',
      valType: 'str',
      crop: true,
      cropLength: 20,
    });
    expect(result).toBe('This is a very long ...');
  });

  it('should join an array of strings with commas if crop is not enabled', () => {
    const result = transformValue({ value: ['One', 'Two', 'Three'] });
    expect(result).toBe('One, Two, Three');
  });

  it('should format a string with underscores to spaces', () => {
    const result = transformValue({ value: 'this_is_a_test' });
    expect(result).toBe('this is a test');
  });

  it('should return the original value if none of the conditions match', () => {
    const customObject = { key: 'Original value' };
    const result = transformValue({ value: customObject });
    expect(result).toEqual(customObject);
  });

  it('should return an empty string if value is "[object Object]"', () => {
    const result = transformValue({ value: '[object Object]' });
    expect(result).toBe('');
  });
});
