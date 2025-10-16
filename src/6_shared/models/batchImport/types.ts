import { delimitersToGuess } from './constants';

export type IImportedFileRow = Record<string, string | boolean | number | null>;
export type ImportDelimiter = (typeof delimitersToGuess)[number];

export interface DataModelRow {
  'File column name': string;
  'File column type': string;
  'Inventory column name': string;
  'Inventory column type': string;
  Constraint: string;
  Required: boolean;
  Status: string;
}

export interface BatchImportData {
  summary: Record<string, string>;
  dataModelRows: DataModelRow[];
  importDataDelimiter: ImportDelimiter;
  importedFileColumnNames: string[];
  importedFileRows: IImportedFileRow[];
  columnNameMapping: Record<string, string>;
  isForcedFileSend: boolean;
}

export interface CheckImportedTprmTableRow {
  id: number;
  tprm: string;
  selectTprm: {
    label: string;
    value: string | number;
  };
}
