import { FilterDataType } from './constants';

export type LogicalOperator = 'and' | 'or';

export interface Expression {
  name?: string;
  logicalOperator?: LogicalOperator;
  filters: Filter[];
}

export interface FilterColumn {
  name: string;
  type: FilterDataType;
  id?: number | string;
  selectOptions?: string[];
}

export interface Filter {
  column: FilterColumn;
  columnType?: FilterDataType;
  operator: string;
  value: string;
  error?: Record<'column' | 'operator' | 'value', boolean>;
}
