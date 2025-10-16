// import { describe, it, expect } from 'vitest';
// import { ObjectByFilters } from '6_shared';
// import { getFilteredData } from '../getFilteredData';
// import { getFilteredObjects } from '../getFilteredObjects';

// const mockObjectByFiltersData = {
//   point_a_name: '',
//   point_b_name: '',
//   geometry: null,
//   p_id: null,
//   latitude: null,
//   longitude: null,
//   active: false,
//   status: null,
//   pov: undefined,
//   version: 0,
//   tmo_id: 0,
//   parent_name: null,
//   point_a_id: null,
//   point_b_id: null,
// };

// describe('getFilteredDataAndObjects', () => {
//   it('should return filtered data and objects based on selectedObjectIds and objectTypeParamTypes', () => {
//     const selectedObjectIds = [1, 3];
//     const paramTypeIds = [1, 2];
//     const data = {
//       '1': 'Data for param 1',
//       '2': 'Data for param 2',
//     };
//     const objectsByFilters: ObjectByFilters[] = [
//       { id: 1, name: 'Object 1', ...mockObjectByFiltersData },
//       { id: 2, name: 'Object 2', ...mockObjectByFiltersData },
//       { id: 3, name: 'Object 3', ...mockObjectByFiltersData },
//     ];

//     const filteredData = getFilteredData({ data, paramTypeIds });
//     const filteredObjects = getFilteredObjects({ selectedObjectIds, objectsByFilters });

//     expect(filteredData).toEqual({
//       '1': 'Data for param 1',
//       '2': 'Data for param 2',
//     });
//     expect(filteredObjects).toEqual([
//       { id: 1, name: 'Object 1', ...mockObjectByFiltersData },
//       { id: 3, name: 'Object 3', ...mockObjectByFiltersData },
//     ]);
//   });

//   it('should return empty filteredData if no matching keys are found', () => {
//     const selectedObjectIds = [1];
//     const paramTypeIds = [99];
//     const data = {
//       '1': 'Data for param 1',
//       '2': 'Data for param 2',
//     };
//     const objectsByFilters = [{ id: 1, name: 'Object 1', ...mockObjectByFiltersData }];

//     const filteredData = getFilteredData({ data, paramTypeIds });
//     const filteredObjects = getFilteredObjects({ selectedObjectIds, objectsByFilters });

//     expect(filteredData).toEqual({});
//     expect(filteredObjects).toEqual([{ id: 1, name: 'Object 1', ...mockObjectByFiltersData }]);
//   });

//   it('should return empty filteredObjects if no matching objects are found', () => {
//     const selectedObjectIds = [4];
//     const paramTypeIds = [1];
//     const data = {
//       '1': 'Data for param 1',
//     };
//     const objectsByFilters = [
//       { id: 1, name: 'Object 1', ...mockObjectByFiltersData },
//       { id: 2, name: 'Object 2', ...mockObjectByFiltersData },
//     ];

//     const filteredData = getFilteredData({ data, paramTypeIds });
//     const filteredObjects = getFilteredObjects({ selectedObjectIds, objectsByFilters });

//     expect(filteredData).toEqual({
//       '1': 'Data for param 1',
//     });
//     expect(filteredObjects).toEqual([]);
//   });

//   it('should handle undefined objectsByFilters correctly', () => {
//     const selectedObjectIds = [1];
//     const paramTypeIds = [1];
//     const data = {
//       '1': 'Data for param 1',
//     };
//     const objectsByFilters: ObjectByFilters[] | undefined = undefined;

//     const filteredData = getFilteredData({ data, paramTypeIds });
//     const filteredObjects = getFilteredObjects({ selectedObjectIds, objectsByFilters });

//     expect(filteredData).toEqual({
//       '1': 'Data for param 1',
//     });
//     expect(filteredObjects).toEqual(undefined);
//   });

//   it('should return empty objectsByFilters when no object ids are selected', () => {
//     const selectedObjectIds: number[] = [];
//     const paramTypeIds = [1];
//     const data = {
//       '1': 'Data for param 1',
//     };
//     const objectsByFilters = [
//       { id: 1, name: 'Object 1', ...mockObjectByFiltersData },
//       { id: 2, name: 'Object 2', ...mockObjectByFiltersData },
//     ];

//     const filteredData = getFilteredData({ data, paramTypeIds });
//     const filteredObjects = getFilteredObjects({ selectedObjectIds, objectsByFilters });

//     expect(filteredData).toEqual({
//       '1': 'Data for param 1',
//     });
//     expect(filteredObjects).toEqual([]);
//   });

//   it('should return empty filteredData when no data is provided', () => {
//     const selectedObjectIds = [1];
//     const paramTypeIds = [1];
//     const data = {};
//     const objectsByFilters = [
//       { id: 1, name: 'Object 1', ...mockObjectByFiltersData },
//       { id: 2, name: 'Object 2', ...mockObjectByFiltersData },
//     ];

//     const filteredData = getFilteredData({ data, paramTypeIds });
//     const filteredObjects = getFilteredObjects({ selectedObjectIds, objectsByFilters });

//     expect(filteredData).toEqual({});
//     expect(filteredObjects).toEqual([{ id: 1, name: 'Object 1', ...mockObjectByFiltersData }]);
//   });
// });
