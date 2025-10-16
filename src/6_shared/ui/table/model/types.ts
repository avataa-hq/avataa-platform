export type Order = 'asc' | 'desc';

export type TableData<T = Record<string, any>> = T[];

export interface TableColumn<T = Record<string, any>> {
  title: string;
  key: string;
  dataIndex?: keyof T;
  align?: 'right' | 'left' | 'center' | 'inherit' | 'justify';
  render?: (item: T) => React.ReactNode;
}

export type TableLabel = Pick<TableColumn, 'title' | 'key' | 'align'>;
