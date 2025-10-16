import { it, describe, expect } from 'vitest';

import { generateLettersId } from '../generateLettersId';

describe('generateLettersId', () => {
  it('should generate an ID with the default length (15)', () => {
    const id = generateLettersId();
    expect(id.length).toBe(15);
  });

  it('should generate an ID with the specified length', () => {
    const id = generateLettersId(10);
    expect(id.length).toBe(10);
  });

  it('should generate IDs containing only letters', () => {
    const id = generateLettersId(20);
    const lettersRegExp = /^[a-zA-Z]+$/;
    expect(id).toMatch(lettersRegExp);
  });

  it('should generate unique IDs', () => {
    const id1 = generateLettersId();
    const id2 = generateLettersId();
    expect(id1).not.toBe(id2);
  });

  it('should return an empty string for a length of 0', () => {
    const id = generateLettersId(0);
    expect(id).toBe('');
  });

  it('should return an empty string for a negative length', () => {
    const id = generateLettersId(-5);
    expect(id).toBe('');
  });
});
