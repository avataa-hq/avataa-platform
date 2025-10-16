import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BatchImportData, DataModelRow, IImportedFileRow, ImportDelimiter } from './types';

const initialState: BatchImportData = {
  summary: {},
  dataModelRows: [],
  importedFileColumnNames: [],
  importedFileRows: [],
  importDataDelimiter: ';',
  columnNameMapping: {},
  isForcedFileSend: false,
};

const batchImportSlice = createSlice({
  name: 'batchImport',
  initialState,
  reducers: {
    setDataModelRows: (state, action: PayloadAction<DataModelRow[]>) => {
      state.dataModelRows = action.payload;
    },
    setImportDataDelimiter: (state, action: PayloadAction<ImportDelimiter>) => {
      state.importDataDelimiter = action.payload;
    },
    setImportedFileColumnNames: (state, action: PayloadAction<string[]>) => {
      state.importedFileColumnNames = action.payload;
    },
    setImportedFileRows: (state, action: PayloadAction<IImportedFileRow[]>) => {
      state.importedFileRows = action.payload;
    },
    setColumnNameMapping: (state, action: PayloadAction<Record<string, string>>) => {
      state.columnNameMapping = action.payload;
    },
    setIsForcedFileSend: (state, action: PayloadAction<boolean>) => {
      state.isForcedFileSend = action.payload;
    },
    restore: (_, action: PayloadAction<BatchImportData>) => action.payload,
  },
});

export const batchImportActions = batchImportSlice.actions;
export const batchImportReducer = batchImportSlice.reducer;
export const batchImportSliceName = batchImportSlice.name;
