import { describe, it, expect } from 'vitest';
import { isValidValue } from '../isValidValue';

describe('isValidValue', () => {
  it('should return false for empty string', () => {
    expect(isValidValue('')).toBe(false);
  });

  it('should return false for null', () => {
    expect(isValidValue(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isValidValue(undefined)).toBe(false);
  });

  it('should return false for empty array', () => {
    expect(isValidValue([])).toBe(false);
  });

  it('should return true for non-empty string', () => {
    expect(isValidValue('some value')).toBe(true);
  });

  it('should return true for number', () => {
    expect(isValidValue(42)).toBe(true);
  });

  it('should return true for non-empty array', () => {
    expect(isValidValue([1, 2, 3])).toBe(true);
  });

  it('should return true for boolean true', () => {
    expect(isValidValue(true)).toBe(true);
  });

  it('should return true for boolean false', () => {
    expect(isValidValue(false)).toBe(true);
  });

  it('should return true for object', () => {
    expect(isValidValue({})).toBe(false);
  });

  it('should return true for non-empty string with spaces', () => {
    expect(isValidValue('  ')).toBe(false);
  });

  it('should return true for number 0', () => {
    expect(isValidValue(0)).toBe(true);
  });
});
