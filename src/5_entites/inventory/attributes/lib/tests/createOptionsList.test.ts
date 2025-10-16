import { describe, it, expect } from 'vitest';
import { IInventoryObjectModel, ObjectByFilters } from '6_shared';
import { createOptionsList } from '../createOptionsList';

const inventoryData: IInventoryObjectModel[] = [
  {
    id: 1,
    name: 'Item 1',
    Name: 'Item One',
    p_id: null,
    point_a_id: null,
    point_b_id: null,
    tmo_id: 123,
    pov: null,
    geometry: null,
    active: true,
    latitude: null,
    longitude: null,
    model: null,
    status: null,
    version: 1,
    parent_name: null,
    document_count: 0,
  },
  {
    id: 2,
    name: 'Item 2',
    Name: 'Item Two',
    p_id: null,
    point_a_id: null,
    point_b_id: null,
    tmo_id: 456,
    pov: null,
    geometry: null,
    active: true,
    latitude: null,
    longitude: null,
    model: null,
    status: null,
    version: 1,
    parent_name: null,
    document_count: 0,
  },
];

const objectByFiltersData: ObjectByFilters[] = [
  {
    id: 3,
    name: 'Filter Item 1',
    point_a_name: '',
    point_b_name: '',
    Name: '',
    p_id: null,
    point_a_id: null,
    point_b_id: null,
    tmo_id: 0,
    pov: undefined,
    geometry: null,
    active: false,
    latitude: null,
    longitude: null,
    model: undefined,
    status: null,
    version: 0,
    parent_name: null,
    document_count: 0,
  },
  {
    id: 4,
    name: 'Filter Item 2',
    point_a_name: '',
    point_b_name: '',
    Name: '',
    p_id: null,
    point_a_id: null,
    point_b_id: null,
    tmo_id: 0,
    pov: undefined,
    geometry: null,
    active: false,
    latitude: null,
    longitude: null,
    model: undefined,
    status: null,
    version: 0,
    parent_name: null,
    document_count: 0,
  },
];

describe('createOptionsList', () => {
  it('should handle empty data', () => {
    expect(createOptionsList([])).toEqual([]);
  });

  it('should create options list from IInventoryObjectModel array', () => {
    expect(createOptionsList(inventoryData)).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]);
  });

  it('should create options list from ObjectByFilters array', () => {
    expect(createOptionsList(objectByFiltersData)).toEqual([
      { id: 3, name: 'Filter Item 1' },
      { id: 4, name: 'Filter Item 2' },
    ]);
  });

  it('should handle null or undefined data', () => {
    expect(createOptionsList(null as any)).toEqual([]);
  });

  it('should handle array with null or undefined elements', () => {
    const mixedData = [{ id: 1, name: 'Item 1' }, null, { id: 2, name: 'Item 2' }, undefined];
    expect(createOptionsList(mixedData as any)).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ]);
  });

  it('should handle objects with null/undefined id or name fields', () => {
    const emptyFieldsData = [
      { id: null, name: 'Item with id null' },
      { id: undefined, name: 'Item with id undefined' },
      { id: 3, name: null },
    ];
    expect(createOptionsList(emptyFieldsData as any)).toEqual([{ id: 3, name: '' }]);
  });
});
