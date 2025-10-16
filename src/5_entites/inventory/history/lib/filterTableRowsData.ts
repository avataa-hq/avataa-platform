import { checkValueType } from './checkValueType';

export const filterTableRowsData = (rowsData: any[], historySearchValue: string) => {
  return rowsData.filter((row) => {
    return Object.values(row).some((value) => checkValueType(value).includes(historySearchValue));
  });
};
