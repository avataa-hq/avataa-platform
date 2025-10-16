import { capitalize } from '6_shared';
import { TableColumn, TableData, TableLabel } from '../model';

export function getTableLabelsFromData<T = Record<string, any>>(
  data: TableData<T>,
  exceptions: string[] = [],
): TableLabel[] {
  const labels = new Set<string>();
  const exceptionList = exceptions && exceptions.map((str) => str.toLowerCase());
  if (data[0]) Object.entries(data[0]).forEach((obj) => labels.add(obj[0]));
  return Array.from(labels)
    .filter((label) => !exceptionList?.includes(label.toLowerCase()) && label[0] !== '_')
    .map((label) => ({
      key: label,
      title: label
        .split('_')
        .map((word) => capitalize(word))
        .join(' '),
    }));
}

export function getTableLabelsFromColumns<T = Record<string, any>>(
  columns: TableColumn<T>[],
): TableLabel[] {
  return columns.map(({ key, title, align }) => ({
    key,
    title,
    align,
  }));
}
