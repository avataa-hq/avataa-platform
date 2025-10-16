import { describe, it, expect } from 'vitest';
import { ObjectByFilters } from '6_shared';
import { createMultipleEditBody } from '../createMultipleEditBody';

const mockAdditionalObjectByFiltersData = {
  point_a_name: '',
  point_b_name: '',
  name: '',
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
};

describe('createMultipleEditBody', () => {
  it('should return empty arrays when filteredObjects is undefined', () => {
    const result = createMultipleEditBody({ objectsByFilters: undefined, newData: {} });
    expect(result).toEqual({ createParamsBody: [], updateParamsBody: [] });
  });

  it('should create body to create new parameters correctly', () => {
    const filteredObjects: ObjectByFilters[] = [
      {
        id: 1,
        parameters: {},
        ...mockAdditionalObjectByFiltersData,
      },
    ];
    const filteredData = { 1: 'value1', 2: 'value2' };

    const result = createMultipleEditBody({
      objectsByFilters: filteredObjects,
      newData: filteredData,
    });

    expect(result).toEqual({
      createParamsBody: [
        {
          object_id: 1,
          new_values: [
            { tprm_id: 1, new_value: 'value1' },
            { tprm_id: 2, new_value: 'value2' },
          ],
        },
      ],
      updateParamsBody: [],
    });
  });

  it('should create body to update existing parameters correctly', () => {
    const filteredObjects: ObjectByFilters[] = [
      {
        id: 2,
        parameters: { 1: 'oldValue1', 2: 'oldValue2' },
        ...mockAdditionalObjectByFiltersData,
      },
    ];
    const filteredData = { 1: 'newValue1', 2: 'newValue2' };

    const result = createMultipleEditBody({
      objectsByFilters: filteredObjects,
      newData: filteredData,
    });

    expect(result).toEqual({
      createParamsBody: [],
      updateParamsBody: [
        {
          object_id: 2,
          new_values: [
            { tprm_id: 1, new_value: 'newValue1' },
            { tprm_id: 2, new_value: 'newValue2' },
          ],
        },
      ],
    });
  });

  it('should handle mixed create body and update body parameters correctly', () => {
    const filteredObjects: ObjectByFilters[] = [
      {
        id: 3,
        parameters: { 1: 'oldValue1' },
        ...mockAdditionalObjectByFiltersData,
      },
    ];
    const filteredData = { 1: 'newValue1', 2: 'newValue2' };

    const result = createMultipleEditBody({
      objectsByFilters: filteredObjects,
      newData: filteredData,
    });

    expect(result).toEqual({
      createParamsBody: [
        {
          object_id: 3,
          new_values: [{ tprm_id: 2, new_value: 'newValue2' }],
        },
      ],
      updateParamsBody: [
        {
          object_id: 3,
          new_values: [{ tprm_id: 1, new_value: 'newValue1' }],
        },
      ],
    });
  });

  it('should handle multiple objects correctly', () => {
    const filteredObjects: ObjectByFilters[] = [
      {
        id: 4,
        parameters: { 1: 'oldValue1' },
        ...mockAdditionalObjectByFiltersData,
      },
      {
        id: 5,
        parameters: {},
        ...mockAdditionalObjectByFiltersData,
      },
    ];
    const filteredData = { 1: 'newValue1', 2: 'newValue2' };

    const result = createMultipleEditBody({
      objectsByFilters: filteredObjects,
      newData: filteredData,
    });

    expect(result).toEqual({
      createParamsBody: [
        {
          object_id: 4,
          new_values: [{ tprm_id: 2, new_value: 'newValue2' }],
        },
        {
          object_id: 5,
          new_values: [
            { tprm_id: 1, new_value: 'newValue1' },
            { tprm_id: 2, new_value: 'newValue2' },
          ],
        },
      ],
      updateParamsBody: [
        {
          object_id: 4,
          new_values: [{ tprm_id: 1, new_value: 'newValue1' }],
        },
      ],
    });
  });
});
