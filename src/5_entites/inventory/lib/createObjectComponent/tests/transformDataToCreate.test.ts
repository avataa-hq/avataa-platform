import { describe, it, expect, vi } from 'vitest';
import { transformDataToCreate } from '../transformDataToCreate';

vi.mock('5_entites', () => ({
  transformParamValue: vi.fn(),
}));

const mockTransformParamValue = vi.fn().mockImplementation(({ value }) => value);

describe('transformDataToCreate', () => {
  it('should return an object with tmo_id and params when only tmo_id is provided', () => {
    const result = transformDataToCreate({
      values: { '1': 'newValue1' },
      objectTmoId: 123,
    });

    expect(result).toEqual({
      tmo_id: 123,
      params: [{ tprm_id: 1, value: mockTransformParamValue({ value: 'newValue1' }) }],
    });
  });

  it('should include optional fields if they are provided', () => {
    const result = transformDataToCreate({
      values: { '1': 'newValue1' },
      objectTmoId: 123,
      objectParentID: 456,
      objectPointAID: 789,
      objectPointBID: 101112,
      lineGeometry: {
        path: [
          [0, 0],
          [1, 1],
        ],
        pathLength: 100,
      },
    });

    expect(result).toEqual({
      tmo_id: 123,
      params: [{ tprm_id: 1, value: mockTransformParamValue({ value: 'newValue1' }) }],
      p_id: 456,
      point_a_id: 789,
      point_b_id: 101112,
      geometry: {
        path: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
        path_length: 100,
      },
    });
  });

  it('should return an empty object if no params are provided', () => {
    const result = transformDataToCreate({
      values: {},
    });

    expect(result).toEqual({});
  });

  it('should handle cases where values do not match initialValues', () => {
    const result = transformDataToCreate({
      values: { '2': 'newValue2' },
      objectTmoId: 123,
    });

    expect(result).toEqual({
      tmo_id: 123,
      params: [],
    });
  });

  it('should handle empty lineGeometry correctly', () => {
    const result = transformDataToCreate({
      values: { '1': 'newValue1' },
      objectTmoId: 123,
      lineGeometry: {
        path: [],
        pathLength: 0,
      },
    });

    expect(result).toEqual({
      tmo_id: 123,
      params: [{ tprm_id: 1, value: mockTransformParamValue({ value: 'newValue1' }) }],
      geometry: {
        path: {
          type: 'LineString',
          coordinates: [],
        },
        path_length: 0,
      },
    });
  });
});
