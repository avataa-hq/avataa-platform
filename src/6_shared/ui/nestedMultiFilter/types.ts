import { ITmoInfo } from '6_shared';
import { FilterDataType } from './config';

export type INestedData<T> = {
  list?: T[];
  isLoading?: boolean;
  isError?: boolean;
};
export interface INestedFilterColumn {
  name: string;
  type: FilterDataType;
  id: string;
  label?: string;
  selectOptions?: string[];
}
interface INestedMultiFilterItemFilter {
  value: string | string[];
  operator: string;
}
export interface INestedMultiFilterItem {
  column: INestedFilterColumn;
  filters: INestedMultiFilterItemFilter[];
  logicalOperator: 'and' | 'or';
}

export interface INestedMultiFilterForm {
  name?: string;
  selectedTmo?: ITmoInfo;
  columnFilters: INestedMultiFilterItem[];
  isPublic?: boolean;
  readonly?: boolean;
}

export type NestedMultiFilterOperators = Record<string, Record<string, string>>;
