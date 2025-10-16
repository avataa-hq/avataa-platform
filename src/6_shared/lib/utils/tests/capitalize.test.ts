import { describe, it, expect } from 'vitest';

import { capitalize } from '../capitalize';

describe('capitalize', () => {
  it('should capitalize a string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should not change a capitalized string', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should not change a string with a capital letter in the middle', () => {
    expect(capitalize('heLlo')).toBe('HeLlo');
  });

  it('should not change a string with a capital letter at the end', () => {
    expect(capitalize('hellO')).toBe('HellO');
  });

  it('should not change an empty string', () => {
    expect(capitalize('')).toBe('');
  });
});
