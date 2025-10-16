import { describe, it, expect } from 'vitest';
import { InventoryParameterTypesModel, InventoryValType } from '6_shared';
import { createOptionalParam } from '../createOptionalParam';

const parameter: Omit<
  InventoryParameterTypesModel,
  'id' | 'name' | 'val_type' | 'group' | 'multiple' | 'constraint'
> = {
  description: null,
  required: false,
  searchable: false,
  returnable: false,
  automation: false,
  prm_link_filter: null,
  tmo_id: 0,
  version: 0,
  created_by: '',
  modified_by: '',
  creation_date: new Date(),
  modification_date: new Date(),
  primary: false,
};

describe('createOptionalParam', () => {
  it('should create a new parameter object with the correct properties', () => {
    const inputParam = {
      group: 'group',
      name: 'Parameter Name',
      id: 123,
      val_type: 'str' as InventoryValType,
      multiple: false,
      constraint: 'constraint',
      ...parameter,
    };

    const expectedOutput = {
      group: 'group',
      label: 'Parameter Name',
      name: '123',
      type: 'str' as InventoryValType,
      multiple: false,
      constraint: 'constraint',
      isMain: true,
      isDeletable: true,
    };

    expect(createOptionalParam(inputParam)).toStrictEqual(expectedOutput);
  });

  it('should convert id to string', () => {
    const inputParam = {
      group: 'group',
      name: 'Parameter Name',
      id: 123,
      val_type: 'str' as InventoryValType,
      multiple: false,
      constraint: 'constraint',
      ...parameter,
    };

    const result = createOptionalParam(inputParam);

    expect(result.name).toBe('123');
  });

  it('should set isMain and isDeletable to true by default', () => {
    const inputParam = {
      group: 'group',
      name: 'Parameter Name',
      id: 123,
      val_type: 'str' as InventoryValType,
      multiple: false,
      constraint: 'constraint',
      ...parameter,
    };

    const result = createOptionalParam(inputParam);

    expect(result.isMain).toBe(true);
    expect(result.isDeletable).toBe(true);
  });
});
