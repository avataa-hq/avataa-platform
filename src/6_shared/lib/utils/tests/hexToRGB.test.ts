import { describe, it, expect } from 'vitest';

import { hexToRGB } from '../hexToRGB';

describe('hexToRGB Function Tests', () => {
  it('should convert a 3-digit hex color to RGB', () => {
    const rgb = hexToRGB('#123');
    expect(rgb).toEqual([17, 34, 51]);
  });

  it('should convert a 6-digit hex color to RGB', () => {
    const rgb = hexToRGB('#1a2b3c');
    expect(rgb).toEqual([26, 43, 60]);
  });

  it('should convert an 8-digit hex color with alpha to RGBA', () => {
    const rgba = hexToRGB('#1a2b3c80');
    expect(rgba?.slice(0, 3)).toEqual([26, 43, 60]);
    expect(rgba?.[3]).toBeCloseTo(0.5, 2);
  });

  it('should convert an 8-digit hex color without alpha to RGB', () => {
    const rgb = hexToRGB('#1a2b3c');
    expect(rgb).toEqual([26, 43, 60]);
  });

  it('should handle lowercase hex letters', () => {
    const rgb = hexToRGB('#aabbcc');
    expect(rgb).toEqual([170, 187, 204]);
  });

  it('should handle uppercase hex letters', () => {
    const rgb = hexToRGB('#AABBCC');
    expect(rgb).toEqual([170, 187, 204]);
  });

  it('should handle invalid hex color format', () => {
    const rgb = hexToRGB('#invalid');
    expect(rgb).toEqual([0, 0, 0]);
  });

  it('should handle empty string', () => {
    const rgb = hexToRGB('');
    expect(rgb).toEqual([0, 0, 0]);
  });

  it('should handle null input', () => {
    // @ts-ignore - intentionally passing an invalid argument
    const rgb = hexToRGB(null);
    expect(rgb).toEqual([0, 0, 0]);
  });

  it('should handle undefined input', () => {
    // @ts-ignore - intentionally passing an invalid argument
    const rgb = hexToRGB(undefined);
    expect(rgb).toEqual([0, 0, 0]);
  });
});
