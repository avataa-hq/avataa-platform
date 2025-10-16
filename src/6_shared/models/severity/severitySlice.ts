import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IColorRangeModel, SelectedColumn, SelectedSeverity, SeverityCount } from '6_shared';

export type Interval = {
  from: string | undefined;
  to: string;
};

export type Period = {
  selected: boolean;
  value: number;
};

export type SeverityRange = {
  [key: string]: { isEmpty?: boolean; from?: number; to?: number; color: string };
};

interface InitialState {
  selectedSeverity: SelectedSeverity;
  isClearedSelected: boolean;
  clearedInterval: Interval;
  severityValues: SeverityCount[];
  severityRanges: SeverityRange[];
  period: Period;
  severityDirection: 'asc' | 'desc';
  selectedColorPalette?: IColorRangeModel;
  severityId: number | null;
  severityInfo: undefined | SelectedColumn;
  showActiveProcesses: boolean;
}

const initialState: InitialState = {
  selectedSeverity: [],
  isClearedSelected: false,
  clearedInterval: {
    from: undefined,
    to: new Date().toISOString(),
  },
  period: {
    selected: true,
    value: 15,
  },
  severityValues: [],
  severityRanges: [],
  severityDirection: 'asc',
  severityId: null,
  severityInfo: undefined,
  showActiveProcesses: true,
  selectedColorPalette: undefined,
};

const severitySlice = createSlice({
  name: 'severity',
  initialState,
  reducers: {
    setSelectedSeverity: (state, { payload }: PayloadAction<SelectedSeverity>) => {
      state.selectedSeverity = payload;
    },
    setIsClearedSelected: (state, { payload }: PayloadAction<boolean>) => {
      state.isClearedSelected = payload;
    },
    setSeverityValues: (state, { payload }: PayloadAction<SeverityCount[]>) => {
      state.severityValues = payload;
    },
    setSeverityRanges: (state, { payload }: PayloadAction<SeverityRange[]>) => {
      state.severityRanges = payload;
    },
    setClearedInterval: (state, { payload }: PayloadAction<Interval>) => {
      state.clearedInterval = payload;
    },
    setPeriodValue: (state, { payload }: PayloadAction<number>) => {
      state.period.value = payload;
    },
    setPeriodSelected: (state, { payload }: PayloadAction<boolean>) => {
      state.period.selected = payload;
    },
    setSeverityDirection: (state, { payload }: PayloadAction<'asc' | 'desc'>) => {
      state.severityDirection = payload;
    },
    setSeverityId: (s, a: PayloadAction<number | null>) => {
      s.severityId = a.payload;
    },
    setSeverityInfo: (state, action: PayloadAction<SelectedColumn>) => {
      state.severityInfo = action.payload;
    },
    setShowActiveProcesses: (state, action: PayloadAction<boolean>) => {
      state.showActiveProcesses = action.payload;
    },
    setSelectedColorPalette: (state, action: PayloadAction<IColorRangeModel | undefined>) => {
      state.selectedColorPalette = action.payload;
    },
    restore: (_, action: PayloadAction<InitialState>) => action.payload,
  },
});

export const severityActions = severitySlice.actions;
export const severityReducer = severitySlice.reducer;
export const severitySliceName = severitySlice.name;
