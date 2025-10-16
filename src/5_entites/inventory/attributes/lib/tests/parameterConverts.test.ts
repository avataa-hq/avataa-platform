import { describe, it, expect } from 'vitest';
import { parameterConverters } from '../parameterConverts';

describe('parameterConverters', () => {
  it('should convert string arrays correctly', () => {
    const input = ['a', 'b', 'c'];
    const result = parameterConverters.str(input);
    expect(result).toEqual(input);
  });

  it('should convert arrays to integers correctly', () => {
    const input = ['1', '2', '3', ''];
    const expected = [1, 2, 3, ''];
    const result = parameterConverters.int(input);
    expect(result).toEqual(expected);
  });

  it('should convert arrays to floats correctly', () => {
    const input = ['1.1', '2.2', '3.3', ''];
    const expected = [1.1, 2.2, 3.3, ''];
    const result = parameterConverters.float(input);
    expect(result).toEqual(expected);
  });

  it('should handle empty string in int converter', () => {
    const input = [''];
    const expected = [''];
    const result = parameterConverters.int(input);
    expect(result).toEqual(expected);
  });

  it('should handle empty string in float converter', () => {
    const input = [''];
    const expected = [''];
    const result = parameterConverters.float(input);
    expect(result).toEqual(expected);
  });

  it('should handle invalid number strings in int converter', () => {
    const input = ['a', '2', 'b'];
    const expected = ['', 2, ''];
    const result = parameterConverters.int(input);
    expect(result).toEqual(expected);
  });

  it('should handle invalid number strings in float converter', () => {
    const input = ['a', '2.2', 'b'];
    const expected = ['', 2.2, ''];
    const result = parameterConverters.float(input);
    expect(result).toEqual(expected);
  });

  it('should handle empty array for str converter', () => {
    const input: string[] = [];
    const result = parameterConverters.str(input);
    expect(result).toEqual([]);
  });

  it('should handle empty array for int converter', () => {
    const input: any[] = [];
    const result = parameterConverters.int(input);
    expect(result).toEqual([]);
  });

  it('should handle empty array for float converter', () => {
    const input: any[] = [];
    const result = parameterConverters.float(input);
    expect(result).toEqual([]);
  });
});
