import { describe, it, expect } from 'vitest';
import { ModuleSettingsLogsSortBy } from '6_shared';
import { transformColumnNamesToSnakeCase } from './transformColumnNamesToSnakeCase';

describe('transformColumnNamesToSnakeCase', () => {
  it('should convert camelCase to snake_case', () => {
    const input: ModuleSettingsLogsSortBy[] = [
      { sort_by: 'camelCaseText', sort_direction: 'asc' },
      { sort_by: 'anotherCamelCase', sort_direction: 'desc' },
    ];
    const expectedOutput: ModuleSettingsLogsSortBy[] = [
      { sort_by: 'camel_case_text', sort_direction: 'asc' },
      { sort_by: 'another_camel_case', sort_direction: 'desc' },
    ];

    expect(transformColumnNamesToSnakeCase(input)).toEqual(expectedOutput);
  });

  it('should keep simple words unchanged', () => {
    const input: ModuleSettingsLogsSortBy[] = [
      { sort_by: 'user', sort_direction: 'asc' },
      { sort_by: 'domain', sort_direction: 'desc' },
    ];
    const expectedOutput: ModuleSettingsLogsSortBy[] = [
      { sort_by: 'user', sort_direction: 'asc' },
      { sort_by: 'domain', sort_direction: 'desc' },
    ];

    expect(transformColumnNamesToSnakeCase(input)).toEqual(expectedOutput);
  });

  it('should handle mixed cases', () => {
    const input: ModuleSettingsLogsSortBy[] = [
      { sort_by: 'someCamelCaseText', sort_direction: 'asc' },
      { sort_by: 'simple', sort_direction: 'desc' },
    ];
    const expectedOutput: ModuleSettingsLogsSortBy[] = [
      { sort_by: 'some_camel_case_text', sort_direction: 'asc' },
      { sort_by: 'simple', sort_direction: 'desc' },
    ];

    expect(transformColumnNamesToSnakeCase(input)).toEqual(expectedOutput);
  });

  it('should handle an empty array', () => {
    const input: ModuleSettingsLogsSortBy[] = [];
    const expectedOutput: ModuleSettingsLogsSortBy[] = [];

    expect(transformColumnNamesToSnakeCase(input)).toEqual(expectedOutput);
  });
});
