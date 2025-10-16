import { describe, it, expect } from 'vitest';
import { cutTypeFromFileName } from '../cutTypeFromFileName';

describe('cutTypeFromFileName', () => {
  it('should remove the file extension and return the base file name', () => {
    const result = cutTypeFromFileName('example.txt');
    expect(result).toBe('example');
  });

  it('should return the same string if there is no file extension', () => {
    const result = cutTypeFromFileName('example');
    expect(result).toBe('example');
  });

  it('should remove the extension when there are multiple periods in the name', () => {
    const result = cutTypeFromFileName('my.document.pdf');
    expect(result).toBe('my.document');
  });

  it('should return an empty string if the input is just a period', () => {
    const result = cutTypeFromFileName('.');
    expect(result).toBe('');
  });

  it('should return an empty string if the input is an empty string', () => {
    const result = cutTypeFromFileName('');
    expect(result).toBe('');
  });

  it('should return an empty string if the input is just a space ', () => {
    const result = cutTypeFromFileName(' ');
    expect(result).toBe('');
  });

  it('should return an empty string if the input is a file name with no extension', () => {
    const result = cutTypeFromFileName('file.');
    expect(result).toBe('file');
  });

  it('should handle edge cases with whitespace', () => {
    const result = cutTypeFromFileName('   .   ');
    expect(result).toBe('');
  });

  it('should return the input if it is "[object Object]"', () => {
    const result = cutTypeFromFileName('[object Object]');
    expect(result).toBe('[object Object]');
  });

  it('should handle complex file names with multiple extensions', () => {
    const result = cutTypeFromFileName('file.tar.gz');
    expect(result).toBe('file.tar');
  });
});
