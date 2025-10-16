// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

interface IProps {
  polygonCoordinates?: GeoJSON.Position[];
  selectedObjectList?: Record<string, any>[];
}

const filterPrimitiveValues = (obj: any) => {
  const excludeKeys = ['visible', 'icon'];
  const result: any = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (
      typeof value !== 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !excludeKeys.includes(key)
    ) {
      result[key] = value;
    }
  });

  return result;
};

export const exportToExcel = async ({ polygonCoordinates, selectedObjectList }: IProps) => {
  const workbook = new ExcelJS.Workbook();

  try {
    if (polygonCoordinates && polygonCoordinates.length !== 0) {
      const polygonSheet = workbook.addWorksheet('PolygonCoordinates');

      polygonSheet.addRow(['Longitude', 'Latitude']);

      polygonCoordinates.forEach((coord) => {
        polygonSheet.addRow([coord[0].toString(), coord[1].toString()]);
      });
    }

    const groupedData: { [tmo_id: number]: Record<string, any>[] } = {};
    if (selectedObjectList) {
      const filteredObjectList = selectedObjectList.map((item) => filterPrimitiveValues(item));

      filteredObjectList.forEach((item) => {
        const { tmo_id } = item;
        if (!groupedData[tmo_id]) {
          groupedData[tmo_id] = [];
        }
        groupedData[tmo_id].push(item);
      });
    }

    Object.keys(groupedData).forEach((tmo_idStr) => {
      const tmo_id = parseInt(tmo_idStr, 10);
      const items = groupedData[tmo_id];

      if (!items || items.length === 0) return;

      const headers = Object.keys(items[0]);

      const sheetName = items[0].tmoName ?? String(tmo_id);
      const worksheet = workbook.addWorksheet(sheetName);

      worksheet.addRow(headers);

      items.forEach((item) => {
        const rowData = headers.map((header) => String(item[header] || ''));
        worksheet.addRow(rowData);
      });
    });

    await workbook.xlsx.writeFile('exportedData.xlsx');
  } catch (error) {
    throw new Error(`Error exporting Excel: ${error}`);
  }
};

// export const exportToExcel = async ({ polygonCoordinates, selectedObjectList }: IProps) => {
//   const wb = XLSX.utils.book_new();

//   try {
//     if (polygonCoordinates && polygonCoordinates.length !== 0) {
//       const polygonSheetData = [['Longitude', 'Latitude']];
//       polygonCoordinates.forEach((coord) =>
//         polygonSheetData.push([coord[0].toString(), coord[1].toString()]),
//       );
//       const polygonWs = XLSX.utils.aoa_to_sheet(polygonSheetData);
//       XLSX.utils.book_append_sheet(wb, polygonWs, 'PolygonCoordinates');
//     }

//     const groupedData: { [tmo_id: number]: Record<string, any>[] } = {};
//     if (selectedObjectList) {
//       const filteredObjectList = selectedObjectList.map((item) => filterPrimitiveValues(item));

//       filteredObjectList.forEach((item) => {
//         const { tmo_id } = item;
//         if (!groupedData[tmo_id]) {
//           groupedData[tmo_id] = [];
//         }
//         groupedData[tmo_id].push(item);
//       });
//     }

//     Object.keys(groupedData).forEach((tmo_idStr) => {
//       const tmo_id = parseInt(tmo_idStr, 10);

//       const headers = Object.keys(groupedData[tmo_id][0]);

//       const sheetData = [headers];
//       groupedData[tmo_id].forEach((item) => {
//         const rowData = headers.map((header) => String(item[header] || ''));
//         sheetData.push(rowData);
//       });

//       const ws = XLSX.utils.aoa_to_sheet(sheetData);
//       XLSX.utils.book_append_sheet(wb, ws, `${groupedData[tmo_id][0].tmoName ?? tmo_id}`);
//     });

//     XLSX.writeFile(wb, 'exportedData.xlsx');
//   } catch (error) {
//     throw new Error(error);
//   }
// };
