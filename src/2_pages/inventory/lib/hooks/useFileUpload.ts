import { SyntheticEvent, useState } from 'react';
import Papa, { ParseResult, ParseError } from 'papaparse';
import {
  delimitersToGuess,
  getDataFromExcelFile,
  IImportedFileRow,
  SUMMARY_SHEET_NUMBER,
  useBatchImport,
} from '6_shared';
import { checkIsTprmColumn } from '5_entites';

export const useFileUpload = () => {
  const { setImportDataDelimiter, setImportedFileColumnNames, setImportedFileRows } =
    useBatchImport();

  const [isFileLoadError, setIsFileLoadError] = useState<boolean>(false);

  const handleFileUpload = async (event: SyntheticEvent) => {
    const reader = new FileReader();

    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
      setIsFileLoadError(true);
      return;
    }

    const file: File = target.files[0];

    const setColumnsData = (columnsData: string[]) => {
      const tprmOnlyColumns = columnsData.filter((column) => checkIsTprmColumn(column, false));
      setImportedFileColumnNames(tprmOnlyColumns);
    };

    const setRowsData = (rowsData: IImportedFileRow[]) => {
      setImportedFileRows(rowsData);
    };

    reader.onload = async (e) => {
      try {
        const result = e.target?.result;
        if (!result) {
          setIsFileLoadError(true);
          return;
        }

        if (file.name.endsWith('.csv')) {
          Papa.parse(file, {
            header: true,
            transform: (value: unknown) => (value === null ? '' : value),
            delimiter: '',
            skipEmptyLines: true,
            dynamicTyping: true,
            delimitersToGuess,
            complete: (parseResult: typeof ParseResult) => {
              parseResult.data.forEach((row: Record<string, unknown>) => {
                Object.keys(row).forEach((key) => {
                  if (row[key] === null) {
                    row[key] = '';
                  }
                });
              });

              setRowsData(parseResult.data);
              setColumnsData(parseResult.meta.fields || []);
              setImportDataDelimiter(parseResult.meta.delimiter);
            },
            error: (error: typeof ParseError) => {
              console.error('Error parsing CSV:', error);
              setIsFileLoadError(true);
            },
          });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const { rows: parsedRows, columnIds: parsedColumns } = await getDataFromExcelFile(
            result as ArrayBuffer,
            SUMMARY_SHEET_NUMBER,
          );

          setColumnsData(parsedColumns);
          setRowsData(parsedRows);
        } else {
          setIsFileLoadError(true);
        }
      } catch (error) {
        console.error('File processing error:', error);
        setIsFileLoadError(true);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return {
    handleFileUpload,
    isFileLoadError,
  };
};
