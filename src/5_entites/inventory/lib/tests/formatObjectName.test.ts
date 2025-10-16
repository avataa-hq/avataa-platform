import { describe, it, expect } from 'vitest';
import { formatObjectName } from '../formatObjectName';

describe('formatObjectName', () => {
  it('should return the same name if it is a non-empty string', () => {
    const result = formatObjectName('ObjectName');
    expect(result).toBe('ObjectName');
  });

  it('should return "No name" if the name is an empty string', () => {
    const result = formatObjectName('');
    expect(result).toBe('No name');
  });

  it('should return "No name" if the name is a string with only spaces', () => {
    const result = formatObjectName('   ');
    expect(result).toBe('No name');
  });

  it('should return the string representation of a number if provided', () => {
    const result = formatObjectName(123 as unknown as string);
    expect(result).toBe('123');
  });

  it('should return "No name" if name is null', () => {
    const result = formatObjectName(null as unknown as string);
    expect(result).toBe('-');
  });

  it('should return "No name" if name is undefined', () => {
    const result = formatObjectName(undefined as unknown as string);
    expect(result).toBe('-');
  });
});
