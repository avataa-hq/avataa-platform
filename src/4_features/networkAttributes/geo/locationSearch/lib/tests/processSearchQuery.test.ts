import { describe, it, expect } from 'vitest';
import { processSearchQuery } from '../processSearchQuery';

describe('processSearchQuery', () => {
  it('should remove second part of date-like patterns', () => {
    const result = processSearchQuery('2024/10');
    expect(result).toBe('2024');
  });

  it('should remove parentheses, quotes, and backticks', () => {
    const result = processSearchQuery('(test) "query" `example`');
    expect(result).toBe('test query example');
  });

  it('should replace multiple spaces with a single space', () => {
    const result = processSearchQuery('multiple     spaces   here');
    expect(result).toBe('multiple spaces here');
  });

  it('should trim leading and trailing spaces', () => {
    const result = processSearchQuery('   trim spaces   ');
    expect(result).toBe('trim spaces');
  });

  it('should convert all characters to lowercase', () => {
    const result = processSearchQuery('ToLowerCase');
    expect(result).toBe('tolowercase');
  });

  it('should handle an empty string input', () => {
    const result = processSearchQuery('');
    expect(result).toBe('');
  });
});
