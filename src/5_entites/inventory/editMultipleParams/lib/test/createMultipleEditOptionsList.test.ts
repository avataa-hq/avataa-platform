import { describe, it, expect } from 'vitest';
import { InventoryParameterTypesModel } from '6_shared';
import { createMultipleEditOptionsList } from '../createMultipleEditOptionsList';

const additionalMockData = {
  name: '',
  description: null,
  multiple: false,
  required: false,
  searchable: false,
  returnable: false,
  automation: false,
  prm_link_filter: null,
  group: null,
  tmo_id: 0,
  version: 0,
  created_by: '',
  modified_by: '',
  creation_date: new Date(),
  modification_date: new Date(),
  primary: false,
};

describe('createMultipleEditOptionsList', () => {
  it('should handle prm_link val_type correctly', () => {
    const data: InventoryParameterTypesModel[] = [
      {
        id: 1,
        val_type: 'prm_link',
        constraint: '11:22',
        ...additionalMockData,
      },
    ];

    expect(createMultipleEditOptionsList(data)).toEqual([
      {
        id: 1,
        val_type: 'prm_link',
        constraint: '22',
        tprm_id: 1,
        value: '',
        ...additionalMockData,
      },
    ]);
  });

  it('should handle prm_link with incorrect val_type correctly', () => {
    const data: InventoryParameterTypesModel[] = [
      {
        id: 1,
        val_type: 'prm_link',
        constraint: '11',
        ...additionalMockData,
      },
    ];

    expect(createMultipleEditOptionsList(data)).toEqual([
      {
        id: 1,
        val_type: 'prm_link',
        constraint: '11',
        tprm_id: 1,
        value: '',
        ...additionalMockData,
      },
    ]);
  });

  it('should handle non-prm_link val_type correctly', () => {
    const data: InventoryParameterTypesModel[] = [
      {
        id: 2,
        val_type: 'str',
        constraint: '',
        ...additionalMockData,
      },
    ];

    expect(createMultipleEditOptionsList(data)).toEqual([
      {
        id: 2,
        val_type: 'str',
        constraint: '',
        tprm_id: 2,
        value: '',
        ...additionalMockData,
      },
    ]);
  });

  it('should filter out formula val_type', () => {
    const data: InventoryParameterTypesModel[] = [
      {
        id: 3,
        val_type: 'formula',
        constraint: '',
        ...additionalMockData,
      },
    ];

    expect(createMultipleEditOptionsList(data)).toEqual([]);
  });

  it('should handle mixed val_type correctly', () => {
    const data: InventoryParameterTypesModel[] = [
      {
        id: 4,
        val_type: 'prm_link',
        constraint: '11:22',
        ...additionalMockData,
      },
      {
        id: 5,
        val_type: 'str',
        constraint: '',
        ...additionalMockData,
      },
      {
        id: 6,
        val_type: 'formula',
        constraint: '',
        ...additionalMockData,
      },
    ];

    expect(createMultipleEditOptionsList(data)).toEqual([
      {
        id: 4,
        val_type: 'prm_link',
        constraint: '22',
        tprm_id: 4,
        value: '',
        ...additionalMockData,
      },
      {
        id: 5,
        val_type: 'str',
        constraint: '',
        tprm_id: 5,
        value: '',
        ...additionalMockData,
      },
    ]);
  });
});
