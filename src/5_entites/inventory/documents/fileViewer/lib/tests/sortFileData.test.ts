import { describe, it, expect, vi, afterEach } from 'vitest';
import { sortFileData } from '../sortFileData';
import { mockFileData } from './mockFileData';

describe('sortFileData', () => {
  const mockSetSortDirection = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should sort by name in ascending order and update sort direction', () => {
    const result = sortFileData({
      newFileData: mockFileData,
      type: '',
      sortDirection: 'asc',
      setSortDirection: mockSetSortDirection,
    });

    expect(result).toEqual([
      mockFileData[2], // 'document1.pdf'
      mockFileData[1], // 'image.png'
      mockFileData[0], // 'presentation.docx'
    ]);

    expect(mockSetSortDirection).toHaveBeenCalledWith('desc');
  });

  it('should sort by name in descending order and update sort direction', () => {
    const result = sortFileData({
      newFileData: mockFileData,
      type: '',
      sortDirection: 'desc',
      setSortDirection: mockSetSortDirection,
    });

    expect(result).toEqual([
      mockFileData[0], // 'presentation.docx'
      mockFileData[1], // 'image.png'
      mockFileData[2], // 'document1.pdf'
    ]);

    expect(mockSetSortDirection).toHaveBeenCalledWith('asc');
  });

  it('should sort by creation date in ascending order and toggle sort direction', () => {
    const result = sortFileData({
      newFileData: mockFileData,
      type: 'date',
      sortDirection: 'asc',
      setSortDirection: mockSetSortDirection,
    });

    expect(result).toEqual([
      mockFileData[0], // 'presentation.docx'
      mockFileData[2], // 'document1.pdf'
      mockFileData[1], // 'image.png'
    ]);

    expect(mockSetSortDirection).toHaveBeenCalled();
  });

  it('should sort by creation date in descending order and toggle sort direction', () => {
    const result = sortFileData({
      newFileData: mockFileData,
      type: 'date',
      sortDirection: 'desc',
      setSortDirection: mockSetSortDirection,
    });

    expect(result).toEqual([
      mockFileData[1], // 'image.png'
      mockFileData[2], // 'document1.pdf'
      mockFileData[0], // 'presentation.docx'
    ]);
    expect(mockSetSortDirection).toHaveBeenCalled();
  });

  it('should return undefined if newFileData is undefined', () => {
    const result = sortFileData({
      newFileData: undefined,
      type: '',
      sortDirection: 'asc',
      setSortDirection: mockSetSortDirection,
    });

    expect(result).toBeUndefined();
    expect(mockSetSortDirection).not.toHaveBeenCalled();
  });

  it('should not change sort direction if type is not provided', () => {
    sortFileData({
      newFileData: mockFileData,
      type: 'invalidType',
      sortDirection: 'asc',
      setSortDirection: mockSetSortDirection,
    });

    expect(mockSetSortDirection).not.toHaveBeenCalled();
  });
});
