import { describe, it, expect } from 'vitest';
import { getNodesWithNewLinks } from '../getNodesWithNewLinks';

describe('getNodesWithNewLink', () => {
  it('correctly adds the connected node id to connection lists', () => {
    expect.hasAssertions();
    const result = getNodesWithNewLinks(
      [
        {
          id: 1,
          x: 342.60223388671875,
          y: -244.79554176330566,
          transform_type: 'extract',
          name: 'i_nsn_lte_cellstats_15m',
          rows_count: 239,
          status: 'accepted',
          connections: {
            from: [],
            to: [],
          },
        },
        {
          id: 2,
          x: 350.92938232421875,
          y: -122.41635131835938,
          transform_type: 'filter',
          name: 'Filter datatime',
          rows_count: 120,
          status: 'accepted',
          connections: {
            from: [],
            to: [],
          },
        },
      ],
      [{ id: 1, source: 1, target: 2 }],
    );
    expect(result).toEqual([
      expect.objectContaining({ id: 1, connections: { from: [], to: [2] } }),
      expect.objectContaining({ id: 2, connections: { from: [1], to: [] } }),
    ]);
  });
});
