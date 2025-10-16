import { describe, it, expect } from 'vitest';

import { isValidUrl } from '../isValidUrl';

describe('isValidUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isValidUrl('https://www.google.com')).toBe(true);
    expect(isValidUrl('https://www.google.com/')).toBe(true);
    expect(isValidUrl('https://www.google.com/search?q=hello')).toBe(true);
    expect(isValidUrl('https://www.google.com/search?q=hello#world')).toBe(true);
    expect(isValidUrl('https://www.google.com/search?q=hello#world?foo=bar')).toBe(true);
    expect(isValidUrl('https://www.google.com/search?q=hello#world?foo=bar&baz=qux')).toBe(true);
    expect(isValidUrl('https://www.google.com/search?q=hello#world?foo=bar&baz=qux/')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('  ')).toBe(false);
    expect(isValidUrl('somerandomtext')).toBe(false);
  });
});
