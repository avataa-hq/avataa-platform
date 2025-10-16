import { describe, it, expect } from 'vitest';
import { transformParamValue } from '../transformParamValue';

describe('transformParamValue', () => {
  it('should return array of ids if value is an array of objects', () => {
    const input = [{ id: 1 }, { id: 2 }];
    const output = transformParamValue({ value: input });
    expect(output).toEqual([1, 2]);
  });

  it('should return the same array if value is an array of non-object items', () => {
    const input = [1, 2, 3];
    const output = transformParamValue({ value: input });
    expect(output).toEqual([1, 2, 3]);
  });

  it('should return value.id if value is an object and returnName is false or undefined', () => {
    const input = { id: 1, name: 'test' };
    const output = transformParamValue({ value: input });
    expect(output).toBe(1);
  });

  it('should return value.name if value is an object and returnName is true', () => {
    const input = { id: 1, name: 'test' };
    const output = transformParamValue({ value: input, returnName: true });
    expect(output).toBe('test');
  });

  it('should return value as is if value is not an object or array', () => {
    const input = 'test';
    const output = transformParamValue({ value: input });
    expect(output).toBe('test');
  });

  it('should return value as is if value is null', () => {
    const input = null;
    const output = transformParamValue({ value: input });
    expect(output).toBe(null);
  });

  it('should handle array of mixed types correctly', () => {
    const input = [{ id: 1 }, 2, { id: 3 }, 'string'];
    const output = transformParamValue({ value: input });
    expect(output).toEqual([1, 2, 3, 'string']);
  });
});
