import { describe, it, expect } from 'vitest';
import { IInventorySearchObjectModel } from '6_shared';
import { createOption } from '../createOption';
import { GroupName } from '../../types';

const mockSearchData = {
  tmo_id: 0,
  active: false,
  p_id: 0,
  version: 0,
  point_a_id: null,
  point_b_id: null,
  status: null,
  model: undefined,
  creation_date: null,
  modification_date: null,
  pov: undefined,
  parameters: {},
};

const groupName: GroupName = 'Objects';

describe('createOption', () => {
  it('should create an option with coordinates and type "Point" when longitude and latitude are provided', () => {
    const item: IInventorySearchObjectModel = {
      id: 1,
      tmo_name: 'TMO 1',
      name: 'Item 1',
      longitude: 40.7128,
      latitude: -74.006,
      geometry: null,
      ...mockSearchData,
    };

    const result = createOption({ item, groupName });

    expect(result).toEqual({
      id: '1',
      tmo_name: 'TMO 1',
      name: 'Item 1',
      group: groupName,
      geometry: {
        coordinates: [40.7128, -74.006],
        type: 'Point',
      },
    });
  });

  it('should set coordinates to null if longitude and latitude are not provided', () => {
    const item: IInventorySearchObjectModel = {
      id: 2,
      tmo_name: 'TMO 2',
      name: 'Item 2',
      longitude: null,
      latitude: null,
      geometry: null,
      ...mockSearchData,
    };

    const result = createOption({ item, groupName });

    expect(result).toEqual({
      id: '2',
      tmo_name: 'TMO 2',
      name: 'Item 2',
      group: groupName,
      geometry: {
        coordinates: null,
        type: null,
      },
    });
  });

  it('should use the type from geometry if available', () => {
    const item: IInventorySearchObjectModel = {
      id: 3,
      tmo_name: 'TMO 3',
      name: 'Item 3',
      longitude: null,
      latitude: null,
      geometry: {
        path: {
          type: 'Polygon',
          coordinates: [],
          path_length: 0,
        },
      },
      ...mockSearchData,
    };

    const result = createOption({ item, groupName });

    expect(result).toEqual({
      id: '3',
      tmo_name: 'TMO 3',
      name: 'Item 3',
      group: groupName,
      geometry: {
        coordinates: null,
        type: 'Polygon',
      },
    });
  });

  it('should return null for type if geometry is provided but path is undefined', () => {
    const item: IInventorySearchObjectModel = {
      id: 4,
      tmo_name: 'TMO 4',
      name: 'Item 4',
      longitude: null,
      latitude: null,
      // @ts-ignore
      geometry: {},
      ...mockSearchData,
    };

    const result = createOption({ item, groupName });

    expect(result).toEqual({
      id: '4',
      tmo_name: 'TMO 4',
      name: 'Item 4',
      group: groupName,
      geometry: {
        coordinates: null,
        type: null,
      },
    });
  });
});
