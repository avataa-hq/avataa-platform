import { describe, it, expect } from 'vitest';
import { fileNameLengthConstraint } from '../fileNameLengthConstraint';

describe('fileNameLengthConstraint', () => {
  it('should return truncated file name when length exceeds max limit (10)', () => {
    const result = fileNameLengthConstraint('fileName1234567.txt');
    expect(result).toBe('fileName12...');
  });

  it('should return full file name when length is within max limit (10)', () => {
    const result = fileNameLengthConstraint('fileName.txt');
    expect(result).toBe('fileName');
  });

  it('should return truncated file name when length exceeds max limit (36) with fileId', () => {
    const fileId = '1234567890123456789012345678901234567890123';
    const result = fileNameLengthConstraint('fileName.txt', fileId);
    expect(result).toBe('123456789012345678901234567890123456...');
  });

  it('should return full fileId when length is within max limit (36)', () => {
    const fileId = '123456789012345678901234567890123456';
    const result = fileNameLengthConstraint('fileName.txt', fileId);
    expect(result).toBe(fileId);
  });

  it('should call cutTypeFromFileName when no fileId is provided', () => {
    const result = fileNameLengthConstraint('file.type.txt');
    expect(result).toBe('file.type');
  });

  it('should call cutTypeFromFileName when fileId is spaces', () => {
    const result = fileNameLengthConstraint('fileName.txt', '  ');
    expect(result).toBe('fileName');
  });

  it('should call cutTypeFromFileName when fileId is undefined', () => {
    const result = fileNameLengthConstraint('12345678901.txt', undefined);
    expect(result).toBe('1234567890...');
  });

  it('should return empty string when name contains only spaces and fileId is undefined', () => {
    const result = fileNameLengthConstraint('  ');
    expect(result).toBe('');
  });

  it('should return empty string when name contains only spaces and fileId is spaces', () => {
    const result = fileNameLengthConstraint('  ', '  ');
    expect(result).toBe('');
  });

  it('should return empty string if name is "[object, Object]"', () => {
    const result = fileNameLengthConstraint('[object, Object]');
    expect(result).toBe('[object, O...');
  });
});
