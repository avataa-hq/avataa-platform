import type { GridFilterModel, GridFilterItem } from '@mui/x-data-grid-premium';

import { transformOperator } from '6_shared/models';
import type { INestedMultiFilterItem } from '../../types';
import { COLUMN_NAME_SEPARATOR, COLUMN_TYPE_SEPARATOR } from '../../config';

const getNameFromSeparatedId = (id: string | number | undefined) => {
  if (id && typeof id === 'string') {
    const splitName = id.split(COLUMN_NAME_SEPARATOR);
    if (splitName[1]) {
      return splitName[1];
    }
  }

  return '';
};

const getMuLtiFilterItems = (
  gridFilterItems: GridFilterItem[],
  logicalOperator: 'and' | 'or' = 'and',
): INestedMultiFilterItem[] => {
  const grouped = gridFilterItems.reduce((acc, i) => {
    const name = getNameFromSeparatedId(i.id);
    let id = i.field;
    let type = 'string';

    const separatedField = i.field.split(COLUMN_TYPE_SEPARATOR);

    if (separatedField.length === 2) {
      const [correctId, correctType] = separatedField;
      id = correctId;
      type = correctType;
    }

    if (!acc[name]) {
      acc[name] = { column: { name, id, type }, filters: [i] };
    } else {
      acc[name].filters.push(i);
    }
    return acc;
  }, {} as Record<string, any>);

  return Object.values(grouped).map((value) => {
    const { column, filters } = value;
    return {
      column,
      logicalOperator: logicalOperator as any,
      filters: filters.map((gI: GridFilterItem) => ({
        operator: transformOperator(gI.operator),
        value: gI.value,
      })),
    };
  });
};

export const transformFromDataGridModel = (dataGridMode: GridFilterModel) => {
  return getMuLtiFilterItems(dataGridMode.items, dataGridMode.logicOperator);
};
