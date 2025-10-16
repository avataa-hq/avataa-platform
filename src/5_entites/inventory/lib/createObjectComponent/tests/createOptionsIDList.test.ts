import { describe, it, expect } from 'vitest';
import { IInventoryObjectModel, ObjectByFilters } from '6_shared';
import { createOptionsIDList } from '../createOptionsIDList';

const mockInventoryData = {
  geometry: null,
  p_id: null,
  latitude: null,
  longitude: null,
  active: false,
  status: null,
  pov: undefined,
  version: 0,
  parent_name: null,
  point_a_id: null,
  point_b_id: null,
};

const mockObjectByFiltersData = {
  point_a_name: '',
  point_b_name: '',
  geometry: null,
  p_id: null,
  latitude: null,
  longitude: null,
  active: false,
  status: null,
  pov: undefined,
  version: 0,
  parent_name: null,
  point_a_id: null,
  point_b_id: null,
};

describe('createOptionsIDList', () => {
  it('should transform IInventoryObjectModel correctly', () => {
    const data: IInventoryObjectModel[] = [
      { id: 1, tmo_id: 101, name: 'Object A', ...mockInventoryData },
      { id: 2, tmo_id: 102, name: 'Object B', ...mockInventoryData },
    ];

    const expected = [
      { id: 1, tmoId: 101, objectName: 'Object A', name: 'Object A' },
      { id: 2, tmoId: 102, objectName: 'Object B', name: 'Object B' },
    ];

    const result = createOptionsIDList(data);
    expect(result).toEqual(expected);
  });

  it('should transform ObjectByFilters correctly', () => {
    const data: ObjectByFilters[] = [
      { id: 3, tmo_id: 103, name: 'Object C', ...mockObjectByFiltersData },
      { id: 4, tmo_id: 104, name: 'Object D', ...mockObjectByFiltersData },
    ];

    const expected = [
      { id: 3, tmoId: 103, objectName: 'Object C', name: 'Object C' },
      { id: 4, tmoId: 104, objectName: 'Object D', name: 'Object D' },
    ];

    const result = createOptionsIDList(data);
    expect(result).toEqual(expected);
  });

  it('should handle empty array', () => {
    const data: IInventoryObjectModel[] = [];

    const expected: any[] = [];

    const result = createOptionsIDList(data);
    expect(result).toEqual(expected);
  });
});
