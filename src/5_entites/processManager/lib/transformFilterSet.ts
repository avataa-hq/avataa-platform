import {
  ColumnFilter,
  FILTER_VALUE_SEPARATOR,
  IFilterSetModel,
  IFilterSetModelItem,
  INestedFilterColumn,
  transformNumericOperators,
} from '6_shared';

const getColumnName = (column: INestedFilterColumn) => {
  return column.id && +column.id < 0 ? column.name : String(column.id);
};

const convertPeriodToMinutes = (period: string | string[], operator: string) => {
  const getTimeInMinutes = (value: string) => {
    const timeData = {
      '5 minutes': 5,
      '15 minutes': 15,
      '30 minutes': 30,
      '1 hour': 60,
      '4 hours': 240,
      '12 hours': 720,
      '1 day': 1440,
      '1 week': 10080,
    };
    return timeData[(value as keyof typeof timeData) ?? '5 minutes'];
  };

  if (operator === 'inPeriod' && !Array.isArray(period)) {
    return String(getTimeInMinutes(period));
  }
  return period;
};

const getValue = (
  operator: string,
  value: string | string[],
  valueType: 'ordinary' | 'stringify' = 'ordinary',
) => {
  if (value === undefined) return '';

  const convertedValue = convertPeriodToMinutes(value, operator);

  if (Array.isArray(convertedValue)) {
    if (valueType === 'stringify') return JSON.stringify(convertedValue);
    return convertedValue;
  }
  const valueToArray = convertedValue.split(FILTER_VALUE_SEPARATOR);
  if (valueToArray.length > 1) {
    if (valueType === 'stringify') return JSON.stringify(valueToArray);
    return valueToArray;
  }
  return convertedValue;
};

export const transformFilterSet = (
  filterSet: IFilterSetModel | IFilterSetModelItem | null,
  valueType: 'ordinary' | 'stringify' = 'ordinary',
): ColumnFilter[] | null => {
  if (!filterSet) return null;

  return filterSet?.filters?.map((filter) => {
    const { filters, column, logicalOperator } = filter;
    return {
      filters: filters?.map((f) => ({
        value: getValue(f.operator, f.value, valueType),
        operator: transformNumericOperators(f.operator),
      })),
      rule: logicalOperator,
      columnName: getColumnName(column),
    };
  });
};
