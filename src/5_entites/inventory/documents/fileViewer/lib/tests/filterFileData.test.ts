import { describe, it, expect } from 'vitest';
import { filterFileData } from '../filterFileData';
import { mockFileData } from './mockFileData';

describe('filterFileData', () => {
  it('should return an empty array if fileData is undefined', () => {
    const result = filterFileData({ fileData: undefined, debounceValue: 'doc' });
    expect(result).toEqual([]);
  });

  it('should return fileData if debounceValue is empty', () => {
    const result = filterFileData({ fileData: mockFileData, debounceValue: '' });
    expect(result).toEqual(mockFileData);
  });

  it('should return fileData if debounceValue contains only spaces', () => {
    const result = filterFileData({ fileData: mockFileData, debounceValue: '  ' });
    expect(result).toEqual(mockFileData);
  });

  it('should filter file data based on creationDate', () => {
    const result = filterFileData({ fileData: mockFileData, debounceValue: '2024-10-01' });
    expect(result).toEqual([mockFileData[0]]);
  });

  it('should filter file data based on attachment name', () => {
    const result = filterFileData({ fileData: mockFileData, debounceValue: 'image' });
    expect(result).toEqual([mockFileData[1]]);
  });

  it('should filter file data based on attachment type', () => {
    const result = filterFileData({ fileData: mockFileData, debounceValue: 'docx' });
    expect(result).toEqual([mockFileData[2]]);
  });

  it('should return all matches regardless of case sensitivity', () => {
    const result = filterFileData({ fileData: mockFileData, debounceValue: 'DOCX' });
    expect(result).toEqual([mockFileData[2]]);
  });

  it('should return an empty array if no matches are found', () => {
    const result = filterFileData({ fileData: mockFileData, debounceValue: 'nonexistent' });
    expect(result).toEqual([]);
  });

  it('should return multiple matches if both creation date and attachment name match', () => {
    const result = filterFileData({ fileData: mockFileData, debounceValue: '2024-10' });
    expect(result).toEqual([mockFileData[0], mockFileData[1]]);
  });

  it('should return multiple matches for similar debounce values', () => {
    const result = filterFileData({ fileData: mockFileData, debounceValue: 'doc' });
    expect(result).toEqual([mockFileData[0], mockFileData[2]]);
  });

  it('should return all matches if debounceValue contains leading and trailing spaces', () => {
    const result = filterFileData({ fileData: mockFileData, debounceValue: '  doc  ' });
    expect(result).toEqual([mockFileData[0], mockFileData[2]]);
  });
});
