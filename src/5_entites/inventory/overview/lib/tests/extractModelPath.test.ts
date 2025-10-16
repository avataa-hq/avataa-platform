import { describe, it, expect } from 'vitest';
import { extractModelPath } from '../extractModelPath';

describe('extractModelPath', () => {
  it('should return the origin and pathname of a valid URL', () => {
    const url = 'https://example.com/path/to/resource';
    const result = extractModelPath(url);
    expect(result).toBe('https://example.com/path/to/resource');
  });

  it('should handle URLs with trailing slashes', () => {
    const url = 'https://example.com/path/to/resource/';
    const result = extractModelPath(url);
    expect(result).toBe('https://example.com/path/to/resource/');
  });

  it('should work with URLs that have query parameters', () => {
    const url = 'https://example.com/path/to/resource?param=value';
    const result = extractModelPath(url);
    expect(result).toBe('https://example.com/path/to/resource');
  });

  it('should work with URLs that have fragments', () => {
    const url = 'https://example.com/path/to/resource#fragment';
    const result = extractModelPath(url);
    expect(result).toBe('https://example.com/path/to/resource');
  });

  it('should work with URLs using HTTP protocol', () => {
    const url = 'http://example.com/path/to/resource';
    const result = extractModelPath(url);
    expect(result).toBe('http://example.com/path/to/resource');
  });

  it('should throw an error for invalid URLs', () => {
    const invalidUrl = '[object Object]';
    expect(() => extractModelPath(invalidUrl)).toThrowError('Invalid URL format');
  });
});
