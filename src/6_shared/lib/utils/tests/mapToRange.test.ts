import { describe, it, expect } from 'vitest';

import { mapToRange } from '../mapToRange';

describe('mapToRange', async () => {
  it('should map a value to a range', async () => {
    const result = mapToRange(0.5, 0, 1, 0, 100);
    expect(result).toBe(50);
  });
});
