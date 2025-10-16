import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { transformDefaultValue } from '../transformDefaultValue';

describe('transformDefaultValue', () => {
  it('should return empty string for undefined', () => {
    expect(transformDefaultValue(undefined)).toBe('');
  });

  it('should return "True" for "bool" valType', () => {
    expect(transformDefaultValue('bool')).toBe('True');
  });

  it('should return current date in "YYYY-MM-DD" format for "date" valType', () => {
    expect(transformDefaultValue('date')).toBe(dayjs().format('YYYY-MM-DD'));
  });

  it('should return current datetime in "YYYY-MM-DDTHH:mm:ss.SSSSSS" format followed by "Z" for "datetime" valType', () => {
    expect(transformDefaultValue('datetime')).toBe(
      `${dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSSSS')}Z`,
    );
  });

  it('should return null for "mo_link" valType', () => {
    expect(transformDefaultValue('mo_link')).toBeNull();
  });

  it('should return null for "prm_link" valType', () => {
    expect(transformDefaultValue('prm_link')).toBeNull();
  });

  it('should return an empty string for any other valType', () => {
    expect(transformDefaultValue('unknown')).toBe('');
    expect(transformDefaultValue()).toBe('');
  });
});
