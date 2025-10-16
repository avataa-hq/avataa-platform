import { describe, it, expect } from 'vitest';
import { filterTraceTableData } from '../filterTraceTableData';

const mockTraceTableData = [
  {
    tmo_name: 'TraceOne',
    mo_id: 101,
    mo_name: 'ModuleOne',
    parent_mo_name: 'ParentModuleOne',
    parent_mo_id: 1001,
    latitude: 45.6789,
    longitude: -123.456,
  },
  {
    tmo_name: 'TraceTwo',
    mo_id: 102,
    mo_name: 'ModuleTwo',
    parent_mo_name: 'ParentModuleTwo',
    parent_mo_id: 1002,
    latitude: 23.4567,
    longitude: 78.9012,
  },
];

describe('filterTraceTableData', () => {
  it('should return all rows if search query is empty', () => {
    const result = filterTraceTableData(mockTraceTableData, '');
    expect(result).toEqual(mockTraceTableData);
  });

  it('should return an empty array when tableRows is an empty array and search query is empty', () => {
    const result = filterTraceTableData([], '');
    expect(result).toEqual([]);
  });

  it('should return an empty array if the tableRows array is empty and search query is not empty', () => {
    const result = filterTraceTableData([], 'TraceOne');
    expect(result).toEqual([]);
  });

  it('should return matching rows based on tmo_name', () => {
    const result = filterTraceTableData(mockTraceTableData, 'TraceOne');
    expect(result).toEqual([mockTraceTableData[0]]);
  });

  it('should return all rows if search query contains only spaces', () => {
    const result = filterTraceTableData(mockTraceTableData, '  ');
    expect(result).toEqual(mockTraceTableData);
  });

  it('should return matching rows based on mo_id', () => {
    const result = filterTraceTableData(mockTraceTableData, '101');
    expect(result).toEqual([mockTraceTableData[0]]);
  });

  it('should return matching rows based on mo_name', () => {
    const result = filterTraceTableData(mockTraceTableData, 'ModuleTwo');
    expect(result).toEqual([mockTraceTableData[1]]);
  });

  it('should return matching rows based on parent_mo_name', () => {
    const result = filterTraceTableData(mockTraceTableData, 'ParentModuleOne');
    expect(result).toEqual([mockTraceTableData[0]]);
  });

  it('should return matching rows based on parent_mo_id', () => {
    const result = filterTraceTableData(mockTraceTableData, '1002');
    expect(result).toEqual([mockTraceTableData[1]]);
  });

  it('should return matching rows based on latitude', () => {
    const result = filterTraceTableData(mockTraceTableData, '23.4567');
    expect(result).toEqual([mockTraceTableData[1]]);
  });

  it('should return matching rows based on longitude', () => {
    const result = filterTraceTableData(mockTraceTableData, '-123.456');
    expect(result).toEqual([mockTraceTableData[0]]);
  });

  it('should be case-insensitive for all fields', () => {
    const result = filterTraceTableData(mockTraceTableData, 'traceone');
    expect(result).toEqual([mockTraceTableData[0]]);
  });

  it('should return an empty array if no rows match the search query', () => {
    const result = filterTraceTableData(mockTraceTableData, 'NonExisting');
    expect(result).toEqual([]);
  });

  it('should handle leading and trailing spaces in search query', () => {
    const result = filterTraceTableData(mockTraceTableData, ' 1001 ');
    expect(result).toEqual([mockTraceTableData[0]]);
  });

  it('should handle decimal values in search correctly', () => {
    const result = filterTraceTableData(mockTraceTableData, '45.6789');
    expect(result).toEqual([mockTraceTableData[0]]);
  });

  it('should handle search queries that partially match values', () => {
    const result = filterTraceTableData(mockTraceTableData, 'Trace');
    expect(result).toEqual(mockTraceTableData);
  });

  it('should handle numeric search queries that partially match values', () => {
    const result = filterTraceTableData(mockTraceTableData, '10');
    expect(result).toEqual(mockTraceTableData);
  });

  it('should return an empty array if search query is "[object Object]"', () => {
    const result = filterTraceTableData(mockTraceTableData, '[object Object]');
    expect(result).toEqual([]);
  });
});
