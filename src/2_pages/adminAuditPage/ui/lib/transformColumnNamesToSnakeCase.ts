import { ModuleSettingsLogsSortBy } from '6_shared';

export const transformColumnNamesToSnakeCase = (
  sortBy: ModuleSettingsLogsSortBy[],
): ModuleSettingsLogsSortBy[] => {
  return sortBy.map((item) => {
    const snakeCaseField = item.sort_by.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    return {
      ...item,
      sort_by: snakeCaseField,
    };
  });
};
