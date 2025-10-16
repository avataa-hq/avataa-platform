import { describe, it, expect, vi } from 'vitest';
import { addObjectModel } from '../addObjectModel';

describe('addObjectModel', () => {
  it('should call addObjectModelFn with correct FormData when objectId and file are not null', async () => {
    const mockAddObjectModelFn = vi.fn();
    const mockFile = new File(['content'], 'filename.txt', { type: 'text/plain' });
    const mockObjectId = 123;

    const expectedFormData = new FormData();
    expectedFormData.append('file', mockFile);
    expectedFormData.append('id', mockObjectId.toString());

    await addObjectModel({
      addObjectModelFn: mockAddObjectModelFn,
      objectId: mockObjectId,
      file: mockFile,
    });

    expect(mockAddObjectModelFn).toHaveBeenCalledWith(expectedFormData);
  });

  it('should not call addObjectModelFn when objectId is null', async () => {
    const mockAddObjectModelFn = vi.fn();
    const mockFile = new File(['content'], 'filename.txt', { type: 'text/plain' });

    await addObjectModel({
      addObjectModelFn: mockAddObjectModelFn,
      objectId: null,
      file: mockFile,
    });

    expect(mockAddObjectModelFn).not.toHaveBeenCalled();
  });

  it('should not call addObjectModelFn when file is null', async () => {
    const mockAddObjectModelFn = vi.fn();
    const mockObjectId = 123;

    await addObjectModel({
      addObjectModelFn: mockAddObjectModelFn,
      objectId: mockObjectId,
      file: null,
    });

    expect(mockAddObjectModelFn).not.toHaveBeenCalled();
  });

  it('should not call addObjectModelFn when both objectId and file are null', async () => {
    const mockAddObjectModelFn = vi.fn();

    await addObjectModel({
      addObjectModelFn: mockAddObjectModelFn,
      objectId: null,
      file: null,
    });

    expect(mockAddObjectModelFn).not.toHaveBeenCalled();
  });
});
