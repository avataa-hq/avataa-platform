import { describe, it, expect } from 'vitest';
import { transformGroupName } from '../transformGroupName';

describe('transformGroupName', () => {
  it('should return "No group" when value is null', () => {
    const result = transformGroupName(null);
    expect(result).toBe('No group');
  });

  it('should return "No group" when value is undefined', () => {
    const result = transformGroupName(undefined);
    expect(result).toBe('No group');
  });

  it('should return "No group" when value is an empty string', () => {
    const result = transformGroupName('');
    expect(result).toBe('No group');
  });

  it('should return "No group" when value is a single space', () => {
    const result = transformGroupName(' ');
    expect(result).toBe('No group');
  });

  it('should return the original value when it is a non-empty string', () => {
    const result = transformGroupName('Group A');
    expect(result).toBe('Group A');
  });

  it('should return the original value when it is a number', () => {
    const result = transformGroupName(123);
    expect(result).toBe(123);
  });

  it('should return "No group" when value is an object', () => {
    const obj = { group: 'Test Group' };
    const result = transformGroupName(obj);
    expect(result).toBe('No group');
  });

  it('should return "No group" when value is multiple spaces', () => {
    const result = transformGroupName('     ');
    expect(result).toBe('No group');
  });

  it('should return the original value when it is a non-empty string with leading/trailing spaces', () => {
    const result = transformGroupName('  Group A  ');
    expect(result).toBe('  Group A  ');
  });

  // Test case special for Alexandr Dimov
  it('should return "No group" when value is an "[object Object]"', () => {
    const result = transformGroupName('[object Object]');
    expect(result).toBe('No group');
  });
});
