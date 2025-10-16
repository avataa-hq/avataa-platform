import { describe, it, expect } from 'vitest';
import { IInventoryGeometryModel, ObjectByFilters } from '6_shared';
import { createMultipleUpdateBody } from '../createMultipleUpdateBody';

const mockPartialObjectByFilters = {
  point_a_name: '',
  point_b_name: '',
  latitude: null,
  longitude: null,
  status: null,
  pov: undefined,
  name: '',
  tmo_id: 0,
  parent_name: null,
};

describe('createMultipleUpdateBody', () => {
  it('should return null if objectsData is undefined', () => {
    const result = createMultipleUpdateBody({
      objectsData: undefined,
      objectIds: [1, 2, 3],
    });
    expect(result).toBeNull();
  });

  it('should return null if objectIds is an empty array', () => {
    const result = createMultipleUpdateBody({
      objectsData: [],
      objectIds: [],
    });
    expect(result).toBeNull();
  });

  it('should return null array if no objects match objectIds', () => {
    const objectsData: ObjectByFilters[] = [
      {
        id: 1,
        version: 1,
        p_id: 1,
        point_a_id: 1,
        point_b_id: 1,
        geometry: null,
        active: true,
        ...mockPartialObjectByFilters,
      },
    ];
    const result = createMultipleUpdateBody({
      objectsData,
      objectIds: [2],
    });
    expect(result).toBeNull();
  });

  it('should return correct UpdateMultipleObjectsBody array for matching objects', () => {
    const objectsData: ObjectByFilters[] = [
      {
        id: 1,
        version: 1,
        p_id: 1,
        point_a_id: 1,
        point_b_id: 1,
        geometry: null,
        active: true,
        ...mockPartialObjectByFilters,
      },
      {
        id: 2,
        version: 1,
        p_id: 2,
        point_a_id: 2,
        point_b_id: 2,
        geometry: null,
        active: true,
        ...mockPartialObjectByFilters,
      },
    ];
    const result = createMultipleUpdateBody({
      objectsData,
      objectIds: [1, 2],
      objectParentID: 3,
      objectPointAID: 3,
      objectPointBID: 3,
      active: true,
    });

    expect(result).toEqual([
      {
        object_id: 1,
        data_for_update: {
          version: 1,
          p_id: 3,
          point_a_id: 3,
          point_b_id: 3,
          active: true,
        },
      },
      {
        object_id: 2,
        data_for_update: {
          version: 1,
          p_id: 3,
          point_a_id: 3,
          point_b_id: 3,
          active: true,
        },
      },
    ]);
  });

  it('should update geometry if it differs from the current geometry', () => {
    const objectGeometry: IInventoryGeometryModel = {
      path: {
        coordinates: [[10, 20]],
        type: 'Point',
      },
      path_length: 0,
    };
    const objectsData: ObjectByFilters[] = [
      {
        id: 1,
        version: 1,
        p_id: 1,
        point_a_id: 1,
        point_b_id: 1,
        geometry: {
          path: {
            coordinates: [[20, 30]],
            type: 'Point',
          },
          path_length: 0,
        },
        active: true,
        ...mockPartialObjectByFilters,
      },
    ];

    const result = createMultipleUpdateBody({
      objectsData,
      objectIds: [1],
      objectGeometry,
    });

    expect(result).toEqual([
      {
        object_id: 1,
        data_for_update: {
          version: 1,
          geometry: objectGeometry,
        },
      },
    ]);
  });

  it('should not update properties if they match existing values and return null', () => {
    const objectsData: ObjectByFilters[] = [
      {
        id: 1,
        version: 1,
        p_id: 2,
        point_a_id: 1,
        point_b_id: 1,
        geometry: null,
        active: true,
        ...mockPartialObjectByFilters,
      },
    ];

    const result = createMultipleUpdateBody({
      objectsData,
      objectIds: [1],
      objectParentID: 2, // Same as current p_id
      objectPointAID: 1, // Same as current point_a_id
      objectPointBID: 1, // Same as current point_b_id
    });

    expect(result).toBeNull();
  });

  it('should skip objects that are not found in objectsData and return null', () => {
    const objectsData: ObjectByFilters[] = [
      {
        id: 1,
        version: 1,
        p_id: 1,
        point_a_id: 1,
        point_b_id: 1,
        geometry: null,
        active: true,
        ...mockPartialObjectByFilters,
      },
    ];

    const result = createMultipleUpdateBody({
      objectsData,
      objectIds: [1, 2], // ID 2 is not present in objectsData
    });

    expect(result).toBeNull();
  });
});
