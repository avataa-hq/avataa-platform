import { expect, it, describe } from 'vitest';

import { getNodeConnectionPoints } from '../lib';

describe('getConnectionPoints()', () => {
  it('works if yDistance > xDistance and nodes are not too close', () => {
    expect.hasAssertions();

    const result = getNodeConnectionPoints(
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 50, y: 100, width: 10, height: 10 },
    );

    expect(result).toEqual([
      expect.objectContaining({ x: 1, y: 0 }),
      expect.objectContaining({ x: -1, y: 0 }),
    ]);
  });

  it('works if yDistance > xDistance and nodes are too close', () => {
    expect.hasAssertions();

    const result = getNodeConnectionPoints(
      { x: 0, y: 0, width: 50, height: 10 },
      { x: 50, y: 100, width: 50, height: 10 },
    );

    expect(result).toEqual([
      expect.objectContaining({ x: 0, y: 1 }),
      expect.objectContaining({ x: 0, y: -1 }),
    ]);
  });

  it('works if yDistance < xDistance and nodes are not too close', () => {
    expect.hasAssertions();

    const result = getNodeConnectionPoints(
      { x: 0, y: 0, width: 10, height: 10 },
      { x: 100, y: 50, width: 10, height: 10 },
    );

    expect(result).toEqual([
      expect.objectContaining({ x: 0, y: 1 }),
      expect.objectContaining({ x: 0, y: -1 }),
    ]);
  });

  it('works if yDistance < xDistance and nodes are too close', () => {
    expect.hasAssertions();

    const result = getNodeConnectionPoints(
      { x: 0, y: 0, width: 10, height: 50 },
      { x: 100, y: 50, width: 10, height: 50 },
    );

    expect(result).toEqual([
      expect.objectContaining({ x: 1, y: 0 }),
      expect.objectContaining({ x: -1, y: 0 }),
    ]);
  });
});
