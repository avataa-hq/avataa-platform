import { describe, it, expect } from 'vitest';
import { IObjectComponentParams } from '6_shared';
import { filterObjectParameters } from '../filterObjectParameters';

const param = {
  group: null,
  val_type: '' as any,
  multiple: false,
  constraint: null,
  description: null,
  required: false,
  searchable: false,
  returnable: false,
  automation: false,
  prm_link_filter: null,
  tmo_id: 0,
  id: 0,
  version: 0,
  created_by: '',
  modified_by: '',
  creation_date: new Date(),
  modification_date: new Date(),
  primary: false,
};

const params: IObjectComponentParams[] = [
  { name: 'Apple', ...param },
  { name: 'Banana', ...param },
  { name: 'Cherry', ...param },
  { name: 'Date', ...param },
  { name: 'Elderberry', ...param },
];

describe('filterObjectParameters', () => {
  it('should filter parameters based on search query', () => {
    const searchQuery = 'a';
    const result = filterObjectParameters(params, searchQuery);
    expect(result).toEqual([
      { label: 'Apple', ...param },
      { label: 'Banana', ...param },
      { label: 'Date', ...param },
    ]);
  });

  it('should return empty array if no matches are found', () => {
    const searchQuery = 'z';
    const result = filterObjectParameters(params, searchQuery);
    expect(result).toEqual([]);
  });

  it('should be case insensitive', () => {
    const searchQuery = 'ChErRy';
    const result = filterObjectParameters(params, searchQuery);
    expect(result).toEqual([{ label: 'Cherry', ...param }]);
  });

  it('should trim search query', () => {
    const searchQuery = '  banana  ';
    const result = filterObjectParameters(params, searchQuery);
    expect(result).toEqual([{ label: 'Banana', ...param }]);
  });

  it('should return all parameters if search query is empty', () => {
    const searchQuery = '';
    const result = filterObjectParameters(params, searchQuery);
    expect(result).toEqual(params);
  });
});
