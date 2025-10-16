import { OperatorType } from '../../api';

export const defaultOperators: Record<string, Record<string, OperatorType>> = {
  string: {
    contains: 'contains',
    'not contains': 'notContains',
    equals: 'equals',
    'not Equals': 'notEquals',
    'ends with': 'endsWith',
    'starts with': 'startsWith',
    'is empty': 'isEmpty',
    'is not empty': 'isNotEmpty',
    'is any of': 'isAnyOf',
    'is not any of': 'isNotAnyOf',
  },
  boolean: { is: 'equals' },
  date: {
    is: 'equals',
    'is not': 'notEquals',
    'is after': 'more',
    'is on or after': 'moreOrEq',
    'is before': 'less',
    'is on or before': 'lessOrEq',
    'is empty': 'isEmpty',
    'is not empty': 'isNotEmpty',
    ago: 'inPeriod',
  },
  dateTime: {
    // is: 'equals',
    // 'is not': 'notEquals',
    'is after': 'more',
    'is on or after': 'moreOrEq',
    'is before': 'less',
    'is on or before': 'lessOrEq',
    'is empty': 'isEmpty',
    'is not empty': 'isNotEmpty',
    ago: 'inPeriod',
  },
  number: {
    '=': 'equals',
    '!=': 'notEquals',
    '<': 'less',
    '<=': 'lessOrEq',
    '>': 'more',
    '>=': 'moreOrEq',
    'is empty': 'isEmpty',
    'is not empty': 'isNotEmpty',
    'is any of': 'isAnyOf',
    'is not any of': 'isNotAnyOf',
  },
  actions: {
    contains: 'contains',
    'not contains': 'notContains',
    equals: 'equals',
    'not Equals': 'notEquals',
    'ends with': 'endsWith',
    'starts with': 'startsWith',
    'is empty': 'isEmpty',
    'is not empty': 'isNotEmpty',
    'is any of': 'isAnyOf',
    'is not any of': 'isNotAnyOf',
  },
  singleSelect: {
    is: 'equals',
    'is not': 'notEquals',
    'is any of': 'isAnyOf',
    'is not any of': 'isNotAnyOf',
  },
};

export type FilterDataType = keyof typeof defaultOperators | string;
export const FILTER_VALUE_SEPARATOR = 'бля';
export const COLUMN_NAME_SEPARATOR = '♥';
export const COLUMN_TYPE_SEPARATOR = '♫';
