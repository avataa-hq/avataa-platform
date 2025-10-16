import { expect, it } from 'vitest';
import { normalizeSpaces } from './normalizeSpaces';

it('string with two or more spaces at the end', () => {
  const str = 'Abc  ';
  const result = normalizeSpaces(str);
  expect(result).toEqual('Abc');
});

it('string with two or more spaces at the beginning', () => {
  const str = '  Abc';
  const result = normalizeSpaces(str);
  expect(result).toEqual('Abc');
});

it('String with two or more spaces between words', () => {
  const str = 'Abc   Abc';
  const result = normalizeSpaces(str);
  expect(result).toEqual('Abc Abc');
});
