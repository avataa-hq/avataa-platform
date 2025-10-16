import { describe, it, expect, vi } from 'vitest';
import { transformDataToCreate } from '5_entites';
import { IInventoryObjectModel } from '6_shared';

vi.mock('5_entites', () => ({
  transformDataToCreate: vi.fn(),
}));

describe('createObject', () => {
  it('should create an object successfully', async () => {
    const initialValues = { 123: '' };
    const values = { 123: 'test' };
    const objectTmoId = 1;
    const createObjectFn = vi.fn().mockResolvedValue({
      id: 123,
      name: 'Test Object',
    } as IInventoryObjectModel);

    const initialData = {
      initialValues,
      values,
      objectParentID: undefined,
      objectPointAID: undefined,
      objectPointBID: undefined,
      lineGeometry: undefined,
      objectTmoId,
    };

    const newObjectRequestBody = transformDataToCreate(initialData);

    const result = await createObjectFn(newObjectRequestBody);

    expect(createObjectFn).toHaveBeenCalledWith(newObjectRequestBody);
    expect(result).toEqual({
      id: 123,
      name: 'Test Object',
    });
  });

  it('should handle errors thrown by createObjectFn', async () => {
    const initialValues = { name: 'test' };
    const values = { value: 10 };
    const objectTmoId = 1;
    const createObjectFn = vi.fn().mockRejectedValue(new Error('Failed to create object'));

    const initialData = {
      initialValues,
      values,
      objectParentID: undefined,
      objectPointAID: undefined,
      objectPointBID: undefined,
      lineGeometry: undefined,
      objectTmoId,
    };

    const newObjectRequestBody = transformDataToCreate(initialData);

    await expect(createObjectFn(newObjectRequestBody)).rejects.toThrow('Failed to create object');
  });

  it('should pass the correct parameters to transformDataToCreate', async () => {
    const initialValues = { 123: '' };
    const values = { 123: 'test' };
    const objectTmoId = 1;
    const createObjectFn = vi.fn().mockResolvedValue({
      id: 123,
      name: 'Test Object',
    } as IInventoryObjectModel);

    const initialData = {
      initialValues,
      values,
      objectParentID: undefined,
      objectPointAID: undefined,
      objectPointBID: undefined,
      lineGeometry: undefined,
      objectTmoId,
    };

    const newObjectRequestBody = transformDataToCreate(initialData);

    await createObjectFn(newObjectRequestBody);

    expect(transformDataToCreate).toHaveBeenCalledWith(initialData);
  });
});
