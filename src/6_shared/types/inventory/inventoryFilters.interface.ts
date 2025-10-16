export interface IInventoryFilterModel {
  columnName: string;
  rule: 'and' | 'or';
  filters: IInventoryFiltersListItem[];
}
interface IInventoryFiltersListItem {
  operator: string;
  value: string | string[];
}
