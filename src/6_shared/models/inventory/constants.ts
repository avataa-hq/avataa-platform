export const FILTER_OPERATOR_NAMES = {
  equals: 'equals',
  contains: 'contains',
  startsWith: 'startsWith',
  endsWith: 'endsWith',
  isEmpty: 'isEmpty',
  isNotEmpty: 'isNotEmpty',
  isAnyOf: 'isAnyOf',
  '=': 'equals',
  '>': 'more',
  '>=': 'moreOrEq',
  '<': 'less',
  '<=': 'lessOrEq',
  notEquals: 'notEquals',
  notContains: 'notContains',
  more: 'more',
  moreOrEq: 'moreOrEq',
  less: 'less',
  lessOrEq: 'lessOrEq',
  is: 'equals',
  not: 'notEquals',
  after: 'more',
  onOrAfter: 'moreOrEq',
  before: 'less',
  onOrBefore: 'lessOrEq',
  inPeriod: 'inPeriod',
};

export const DEFAULT_PAGINATION_MODEL = { pageSize: 50, page: 0 };
export const PAGINATION_OPTIONS = [15, 30, 50, 100];

export const UNGROUPED_COLUMNS_GROUP_NAME = 'No group';
export const NOT_TPRM_COLUMNS_GROUP_NAME = 'System Data';
export const PARENT_PARAM_COLUMNS_GROUP_NAME = 'Parents parameters';

export const OBJECT_ID_COLUMN_ID = 'id';
export const OBJECT_PARENT_COLUMN_ID = 'parent_name';
export const OBJECT_CREATION_DATE_COLUMN_ID = 'creation_date';
export const OBJECT_MODIFICATION_DATE_COLUMN_ID = 'modification_date';
export const HAS_FILES_COLUMN_ID = 'document_count';
export const POINT_A_NAME = 'point_a_name';
export const POINT_B_NAME = 'point_b_name';
export const OBJECT_NAME = 'name';

export const ATTRIBUTES_IGNORED_IN_BATCH_IMPORT = [
  OBJECT_ID_COLUMN_ID,
  OBJECT_CREATION_DATE_COLUMN_ID,
  OBJECT_MODIFICATION_DATE_COLUMN_ID,
  HAS_FILES_COLUMN_ID,
  OBJECT_NAME,
];

export const ATTRIBUTES_ALLOWED_IN_BATCH_IMPORT = [
  OBJECT_PARENT_COLUMN_ID,
  POINT_A_NAME,
  POINT_B_NAME,
];

export const INVENTORY_ATTRIBUTE_LIST = [
  OBJECT_ID_COLUMN_ID,
  OBJECT_CREATION_DATE_COLUMN_ID,
  OBJECT_MODIFICATION_DATE_COLUMN_ID,
  HAS_FILES_COLUMN_ID,
  OBJECT_NAME,
  OBJECT_PARENT_COLUMN_ID,
  POINT_A_NAME,
  POINT_B_NAME,
];

export const NOT_TPRM_COLUMNS_NUMBER = 6;
export const ESTIMATE_SYMBOL_WIDTH = 12;
export const COLUMNS_NUMBER_BREAKPOINT = 12;
export const COLUMN_NAME_LENGTH_BREAKPOINT = 40;
export const LONG_COLUMN_WIDTH = 300;

export const defaultColumnVisibilityModel = {
  [OBJECT_ID_COLUMN_ID]: false,
  [OBJECT_CREATION_DATE_COLUMN_ID]: false,
  [OBJECT_MODIFICATION_DATE_COLUMN_ID]: false,
  [POINT_A_NAME]: false,
  [POINT_B_NAME]: false,
};

export const transformOperator = (operator: string) => {
  return FILTER_OPERATOR_NAMES[operator as keyof typeof FILTER_OPERATOR_NAMES] || 'equals';
};
