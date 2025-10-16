import Papa from 'papaparse';

export const FILE_COLUMN_NAME = 'File column name';
export const FILE_COLUMN_TYPE = 'File column type';
export const INVENTORY_COLUMN_TYPE = 'Inventory column type';
export const INVENTORY_COLUMN_NAME = 'Inventory column name';
export const STATUS_FIELD = 'Status';
export const IS_CONSTRAINT = 'Constraint';
export const IS_REQUIRED = 'Required';

export const delimitersToGuess = [
  ',',
  '\t',
  '|',
  ';',
  '~',
  '*',
  '#',
  '@',
  '^',
  Papa.RECORD_SEP,
  Papa.UNIT_SEP,
] as const;

export const SUMMARY_SHEET_NUMBER = 0;
export const DATA_MODEL_SHEET_NUMBER = 1;
// export const UPDATE_SHEET_NUMBER = 2;
// export const NEW_SHEET_NUMBER = 3;
export const ERRORS_SHEET_NUMBER = 4;
