import { describe, it, expect } from 'vitest';
import { isArraysEqual } from '../isArraysEqual';

describe('isArraysEqual', () => {
  it('should return true for two empty arrays', () => {
    expect(isArraysEqual([], [])).toBe(true);
  });

  it('should return true for two equal arrays with primitive values', () => {
    expect(isArraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('should return false for arrays of different lengths', () => {
    expect(isArraysEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('should return true for arrays with same values in different order', () => {
    expect(isArraysEqual([1, 2, 3], [3, 2, 1])).toBe(true);
  });

  it('should return false for arrays with different values', () => {
    expect(isArraysEqual([1, 2, 3], [4, 5, 6])).toBe(false);
  });

  it('should return false for arrays with complex objects that are deeply equal', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };
    expect(isArraysEqual([obj1], [obj2])).toBe(false);
  });

  it('should return true for arrays with identical references', () => {
    const obj = { a: 1, b: 2 };
    expect(isArraysEqual([obj], [obj])).toBe(true);
  });

  it('should return false when the first argument is not an array', () => {
    expect(isArraysEqual(1, [1, 2, 3])).toBe(false);
  });

  it('should return false when the second argument is not an array', () => {
    expect(isArraysEqual([1, 2, 3], { a: 1 })).toBe(false);
  });

  it('should return false when both arguments are not arrays', () => {
    expect(isArraysEqual({ a: 1 }, { b: 2 })).toBe(false);
  });

  it('should return false when the arguments are null or undefined', () => {
    expect(isArraysEqual(null, undefined)).toBe(false);
  });
});
