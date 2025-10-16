// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

interface IResult {
  rows: any[];
  columnIds: string[];
}

export const getDataFromExcelFile = async (
  data: Blob | ArrayBuffer,
  sheetNumber: number,
): Promise<IResult> => {
  try {
    const workbook = new ExcelJS.Workbook();

    if (data instanceof Blob) {
      const buffer = await data.arrayBuffer();
      await workbook.xlsx.load(buffer);
    } else {
      await workbook.xlsx.load(data);
    }

    if (sheetNumber < 0 || sheetNumber >= workbook.worksheets.length) {
      throw new Error('Invalid sheet number');
    }

    const worksheet = workbook.worksheets[sheetNumber];

    if (!worksheet) {
      throw new Error('Worksheet not found');
    }

    const firstRow = worksheet.getRow(1);
    const columnIds: string[] = firstRow.values
      ? (firstRow.values as any[]).slice(1).map((v) => String(v || ''))
      : [];

    const rows: any[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const rowData: Record<string, any> = {};
      columnIds.forEach((colId, idx) => {
        rowData[colId] = row.getCell(idx + 1).value ?? '';
      });
      rows.push(rowData);
    });

    // this is for xlsx
    // const workbook = XLSX.read(data);

    // if (sheetNumber < 0 || sheetNumber >= workbook.SheetNames.length) {
    //   throw new Error('Invalid sheet number');
    // }

    // const sheetName = workbook.SheetNames[sheetNumber];
    // const sheet = workbook.Sheets[sheetName];

    // const range = XLSX.utils.decode_range(sheet['!ref']!);
    // const firstRowRange = {
    //   s: { r: 0, c: range.s.c },
    //   e: { r: 0, c: range.e.c },
    // };

    // const columnIds = XLSX.utils.sheet_to_json(sheet, {
    //   header: 1,
    //   range: firstRowRange,
    //   defval: '',
    // })[0] as string[];

    // const rows = XLSX.utils.sheet_to_json(sheet, {
    //   defval: '',
    // });
    // this is for xlsx

    return { rows, columnIds };
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return { rows: [], columnIds: [] };
  }
};
