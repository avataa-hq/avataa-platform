import { describe, it, expect } from 'vitest';

import { randomInt } from '../randomInt';

describe('randomInt', () => {
  it('should return a random number between 1 and 10', () => {
    const randomNumber = randomInt(1, 10);
    expect(randomNumber).toBeGreaterThanOrEqual(1);
    expect(randomNumber).toBeLessThanOrEqual(10);
  });

  it('should work with negative numbers', () => {
    const randomNumber = randomInt(-10, -1);
    expect(randomNumber).toBeGreaterThanOrEqual(-10);
    expect(randomNumber).toBeLessThanOrEqual(-1);
  });
});
