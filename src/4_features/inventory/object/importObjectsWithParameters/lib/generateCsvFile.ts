import { ImportDelimiter } from '6_shared';

export type CsvRowArray = (string | boolean | number | null)[];
export const generateCsvFile = (
  columns: (string | number)[],
  rows: CsvRowArray[],
  delimiter: ImportDelimiter,
) => {
  const csvData = [columns, ...rows];
  const csvContent = csvData
    .map((innerArr) => innerArr.map((item) => `"${item}"`).join(delimiter))
    .join('\n');

  return new Blob([csvContent], { type: 'text/csv' });
};
