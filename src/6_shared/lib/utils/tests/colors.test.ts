import { describe, it, expect } from 'vitest';

import { getColorFromGradient, interpolateHexColor } from '../colors';

describe('interpolateHexColors', () => {
  it('should interpolate 50% of red color', () => {
    expect(interpolateHexColor('#FF0000', '#000000', 0.5)).toBe('#800000');
  });

  it('should interpolate 30% of green color', () => {
    expect(interpolateHexColor('#000000', '#00FF00', 0.3)).toBe('#004D00');
  });

  it('should interpolate 70% of blue color', () => {
    expect(interpolateHexColor('#000000', '#0000FF', 0.7)).toBe('#0000B3');
  });

  it('should interpolate 3 digits hex colors', () => {
    expect(interpolateHexColor('#F00', '#000', 0.5)).toBe('#800000');
  });

  it('should interpolate 8 digits hex colors', () => {
    expect(interpolateHexColor('#FF0000FF', '#00000000', 0.5)).toBe('#80000080');
  });
});

describe('getColorFromGradient', () => {
  it('should not break if gradient array is too short', () => {
    expect(getColorFromGradient(0, [])).toBeTypeOf('string');
  });

  it('should return first gradient color if index <= 0', () => {
    expect(getColorFromGradient(-0.5, ['#004D00', '#800000', '#0000FF'])).toBe('#004D00');
  });

  it('should return last gradient color if index >= 1', () => {
    expect(getColorFromGradient(1.5, ['#004D00', '#800000', '#0000FF'])).toBe('#0000FF');
  });

  it('should return gradient color correctly', () => {
    expect(
      getColorFromGradient(0.5, [
        '#9e0142',
        '#d53e4f',
        '#f46d43',
        '#fdae61',
        '#fab500',
        '#fee08b',
        '#e6f598',
        '#abdda4',
        '#66c2a5',
        '#00A143',
        '#3288bd',
        '#5e4fa2',
      ]),
    ).toBe(interpolateHexColor('#fee08b', '#e6f598', 0.5));
  });
});
