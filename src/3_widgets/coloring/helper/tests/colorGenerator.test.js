import { describe, it, expect } from 'vitest';
import colorBetweenGenerator, { expandHexCode } from '../colorGenerator';

describe('expandHexCode', () => {
  it('should expand shorthand hex code to full length', () => {
    expect(expandHexCode('#abc')).toBe('#aabbcc');
  });

  it('should return the original hex code if already full length', () => {
    expect(expandHexCode('#abcdef')).toBe('#abcdef');
  });

  it('should handle uppercase shorthand hex code', () => {
    expect(expandHexCode('#ABC')).toBe('#AABBCC');
  });

  it('should handle mixed case shorthand hex code', () => {
    expect(expandHexCode('#aBc')).toBe('#aaBBcc');
  });

  it('should return the original hex code if it is not a valid shorthand', () => {
    expect(expandHexCode('#abcd')).toBe('#abcd');
  });
});

describe('colorBetweenGenerator', () => {
  it('should throw an error for invalid startColor', () => {
    expect(() => colorBetweenGenerator('invalid', '#ffffff', 50)).toThrow('Invalid color');
  });

  it('should throw an error for invalid endColor', () => {
    expect(() => colorBetweenGenerator('#000000', 'invalid', 50)).toThrow('Invalid color');
  });

  it('should return the start color for 0% percentage', () => {
    expect(colorBetweenGenerator('#000000', '#ffffff', 0)).toBe('#000000');
  });

  it('should return the end color for 100% percentage', () => {
    expect(colorBetweenGenerator('#000000', '#ffffff', 100)).toBe('#ffffff');
  });

  it('should return the middle color for 50% percentage', () => {
    expect(colorBetweenGenerator('#000000', '#ffffff', 50)).toBe('#808080');
  });

  it('should handle shorthand hex codes', () => {
    expect(colorBetweenGenerator('#000', '#fff', 50)).toBe('#808080');
  });

  it('should cap the percentage at 100', () => {
    expect(colorBetweenGenerator('#000000', '#ffffff', 150)).toBe('#ffffff');
  });

  it('should floor the percentage at 0', () => {
    expect(colorBetweenGenerator('#000000', '#ffffff', -50)).toBe('#000000');
  });

  it('should correctly calculate the intermediate color', () => {
    expect(colorBetweenGenerator('#ff0000', '#00ff00', 25)).toBe('#bf4000');
  });

  it('should correctly handle uppercase hex codes', () => {
    expect(colorBetweenGenerator('#FF0000', '#00FF00', 25)).toBe('#bf4000');
  });
});
