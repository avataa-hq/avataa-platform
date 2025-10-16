import { describe, it, expect, vi } from 'vitest';
import { IInventoryObjectModel } from '6_shared';
import { deleteObjectParameter } from '../deleteObjectParameter';

const inventoryObjectData: IInventoryObjectModel = {
  geometry: null,
  id: 0,
  p_id: null,
  latitude: null,
  longitude: null,
  active: false,
  status: null,
  pov: undefined,
  version: 0,
  name: '',
  tmo_id: 0,
  parent_name: null,
  point_a_id: null,
  point_b_id: null,
  params: [
    {
      tprm_id: 1,
      id: 0,
      version: 0,
      mo_id: 0,
      value: '',
    },
  ],
};

describe('deleteObjectParameter', () => {
  it('should call deleteObjectParameterFn with correct parameters when all conditions are met', async () => {
    const mockDeleteObjectParameterFn = vi.fn().mockResolvedValueOnce({});
    const props = {
      deleteObjectParameterFn: mockDeleteObjectParameterFn,
      inventoryObjectData,
      objectId: 123,
      paramTypeId: 1,
      fieldValue: 'some value',
    };

    await deleteObjectParameter(props);
    expect(mockDeleteObjectParameterFn).toHaveBeenCalledWith({ object_id: 123, param_type_id: 1 });
    expect(mockDeleteObjectParameterFn).toHaveBeenCalledTimes(1);
  });

  it('should not call deleteObjectParameterFn when objectId is null', async () => {
    const mockDeleteObjectParameterFn = vi.fn();
    const props = {
      deleteObjectParameterFn: mockDeleteObjectParameterFn,
      inventoryObjectData,
      objectId: null,
      paramTypeId: 1,
      fieldValue: 'some value',
    };

    await deleteObjectParameter(props);
    expect(mockDeleteObjectParameterFn).not.toHaveBeenCalled();
  });

  it('should not call deleteObjectParameterFn when fieldValue is empty', async () => {
    const mockDeleteObjectParameterFn = vi.fn();
    const props = {
      deleteObjectParameterFn: mockDeleteObjectParameterFn,
      inventoryObjectData,
      objectId: 123,
      paramTypeId: 1,
      fieldValue: '',
    };

    await deleteObjectParameter(props);
    expect(mockDeleteObjectParameterFn).not.toHaveBeenCalled();
  });

  it('should not call deleteObjectParameterFn when paramTypeId is not in inventoryObjectData params', async () => {
    const mockDeleteObjectParameterFn = vi.fn();
    const props = {
      deleteObjectParameterFn: mockDeleteObjectParameterFn,
      inventoryObjectData,
      objectId: 123,
      paramTypeId: 2,
      fieldValue: 'some value',
    };

    await deleteObjectParameter(props);
    expect(mockDeleteObjectParameterFn).not.toHaveBeenCalled();
  });

  it('should not call deleteObjectParameterFn when inventoryObjectData is undefined', async () => {
    const mockDeleteObjectParameterFn = vi.fn();
    const props = {
      deleteObjectParameterFn: mockDeleteObjectParameterFn,
      inventoryObjectData: undefined,
      objectId: 123,
      paramTypeId: 1,
      fieldValue: 'some value',
    };

    await deleteObjectParameter(props);
    expect(mockDeleteObjectParameterFn).not.toHaveBeenCalled();
  });

  it('should throw an error if deleteObjectParameterFn throws an error', async () => {
    const mockDeleteObjectParameterFn = vi.fn().mockRejectedValue(new Error('Test error'));
    const props = {
      deleteObjectParameterFn: mockDeleteObjectParameterFn,
      inventoryObjectData,
      objectId: 123,
      paramTypeId: 1,
      fieldValue: 'some value',
    };

    await expect(deleteObjectParameter(props)).rejects.toThrowError('Test error');
  });

  it('should throw error if deleteObjectParameterFn is not a function', async () => {
    const mockDeleteObjectParameterFn = vi.fn();
    const props = {
      deleteObjectParameterFn: undefined as any,
      inventoryObjectData,
      objectId: 123,
      paramTypeId: 1,
      fieldValue: 'some value',
    };

    await expect(deleteObjectParameter(props)).rejects.toThrowError();
    expect(mockDeleteObjectParameterFn).not.toHaveBeenCalled();
  });
});
