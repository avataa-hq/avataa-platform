import { GridColumnVisibilityModel } from '@mui/x-data-grid-premium';
import { INestedMultiFilterForm } from '6_shared';

interface IProps {
  filterSettings: INestedMultiFilterForm;
  columnSettings: GridColumnVisibilityModel;
  defaultColumnsSettings: GridColumnVisibilityModel;
}

export const useGetSettingsIndicator = ({
  filterSettings,
  columnSettings,
  defaultColumnsSettings,
}: IProps) => {
  const getFiltersIndicator = () => {
    if (!filterSettings) return 'none';
    if (filterSettings?.columnFilters.length) return 'block';
    return 'none';
  };

  const getColumnsIndicator = () => {
    if (!columnSettings) return 'none';

    const notDefaultColumns: string[] = [];
    const keys = Object.keys(columnSettings);

    keys.forEach((key) => {
      const value = columnSettings[key];

      if (
        (defaultColumnsSettings.hasOwnProperty(key) &&
          defaultColumnsSettings[key as unknown as keyof typeof defaultColumnsSettings] !==
            value) ||
        (!defaultColumnsSettings.hasOwnProperty(key) && value === false)
      ) {
        notDefaultColumns.push(key);
      }
    });

    if (notDefaultColumns.length) return 'block';

    return 'none';
  };

  return { getFiltersIndicator, getColumnsIndicator };
};
