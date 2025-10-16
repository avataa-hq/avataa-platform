import { GetOperatorType, InventoryValType, NestedMultiFilterOperators } from '6_shared';

const convertToParamTypeFromParamType = (valType: InventoryValType): string => {
  switch (valType) {
    case 'str':
    case 'user_link':
    case 'mo_link':
      return 'string';
    case 'formula':
    case 'int':
    case 'float':
    case 'sequence':
      return 'number';
    case 'bool':
      return 'boolean';
    case 'enum':
      return 'enum';
    case 'datetime':
      return 'dateTime';
    case 'date':
      return 'date';
    default:
      return 'string';
  }
};

export const operatorValues: Record<string, string> = {
  contains: 'contains',
  notContains: 'not contains',
  equals: 'equals',
  notEquals: 'not equals',
  startsWith: 'starts with',
  endsWith: 'ends with',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
  isAnyOf: 'is any of',
  isNotAnyOf: 'is not any of',
  more: 'is more',
  moreOrEq: 'is more or equal',
  less: 'is less',
  lessOrEq: 'is less or equal',
  inPeriod: 'ago',
};

export const transformToMultiFilterOperators = (
  filters: GetOperatorType | undefined,
): NestedMultiFilterOperators | undefined => {
  if (!filters) return undefined;

  const result: NestedMultiFilterOperators = {};

  Object.entries(filters).forEach(([key, operators]) => {
    const valType = convertToParamTypeFromParamType(key as InventoryValType);
    result[valType] = {};

    Object.keys(operators).forEach((operator) => {
      const operatorKey = operators[operator as keyof typeof operators];
      const mappedOperator = operatorValues[operatorKey as keyof typeof operatorValues];

      if (mappedOperator !== undefined) {
        result[valType][mappedOperator] =
          (operators[operator as keyof typeof operators] as string) ?? '';
      }
    });
  });
  return result;
};
