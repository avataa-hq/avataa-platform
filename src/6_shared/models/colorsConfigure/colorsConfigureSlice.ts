import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IColorRangeModel, Color } from '6_shared';

export type ValidValueTypes = 'General' | 'Percent' | 'Hex';

export type TprmData = {
  id: number | string;
  name: string;
  val_type: string;
};

type NewColorObject = {
  name: string;
  index: number;
  hex: string;
  booleanValue?: boolean;
};

export type PaletteSettings = Partial<IColorRangeModel>;

interface IInitialState {
  selectedColor: IColorRangeModel | null;
  colorValueType: ValidValueTypes;
  colorPalleteName: string;
  newColorsArray: Color[];
  isOnlyPrivateColors: boolean;
  isPrivateColor: boolean;
  isDefaultColor: boolean;
  withCleared: boolean;
  withIndeterminate: boolean;
  selectedColorId: number | null;
  colorSliderValues: number[];
  defaultColor: IColorRangeModel | null;
  severityDirection: 'asc' | 'desc';
  isEditColors: boolean;

  selectedPalette: { [key: string]: PaletteSettings };
  isEditPalette: { [key: string]: boolean };

  isOpenColorSelecting: { [key: string]: boolean };
  isOpenColorSettings: { [key: string]: boolean };
  currentTmoId: { [key: string]: number | string };
  currentTmoType: { [key: string]: string };
  currentTprm: { [key: string]: TprmData | undefined };

  currentPaletteIds: { [key: string]: { [key: string]: number } };
}

const initialState: IInitialState = {
  selectedColor: null,
  colorValueType: 'General',
  colorPalleteName: '',
  newColorsArray: [],
  isOnlyPrivateColors: false,
  isPrivateColor: false,
  isDefaultColor: false,
  withCleared: false,
  withIndeterminate: false,
  selectedColorId: null,
  isEditColors: false,
  colorSliderValues: [],
  defaultColor: null,
  severityDirection: 'asc',

  selectedPalette: {},
  isEditPalette: {},

  isOpenColorSelecting: {},
  isOpenColorSettings: {},
  currentTmoId: {},
  currentTmoType: {},
  currentTprm: {},

  currentPaletteIds: {},
};

const colorsConfigureSlice = createSlice({
  name: 'colorsConfigure',
  initialState,
  reducers: {
    setSelectedColor(state, action: PayloadAction<IColorRangeModel | null>) {
      state.selectedColor = action.payload;
    },
    setColorValueType(state, action: PayloadAction<ValidValueTypes>) {
      state.colorValueType = action.payload;
    },
    setColorPaletteName(state, action: PayloadAction<string>) {
      state.colorPalleteName = action.payload;
    },
    setNewColor: (s, a: PayloadAction<NewColorObject>) => {
      const newId = Date.now().toString();
      const newRow = {
        name: a.payload.name,
        id: newId,
        hex: a.payload.hex,
        ...(a.payload.booleanValue && { booleanValue: a.payload.booleanValue }),
      };

      s.newColorsArray.splice(a.payload.index + 1, 0, newRow);
    },
    setNewColorsArray: (s, a: PayloadAction<Color[]>) => {
      s.newColorsArray = a.payload;
    },
    setRenameColorTier: (s, a: PayloadAction<NewColorObject>) => {
      const { index, name } = a.payload;
      const newArray = [...s.newColorsArray];

      newArray[index].name = name;
      s.newColorsArray = newArray;
    },
    setNewColorPallete: (s, a: PayloadAction<Color[]>) => {
      s.newColorsArray = a.payload;
    },
    setIsOnlyPrivateColors: (s, a: PayloadAction<boolean>) => {
      s.isOnlyPrivateColors = a.payload;
    },
    setIsPrivateColor: (s, a: PayloadAction<boolean>) => {
      s.isPrivateColor = a.payload;
    },
    setIsDefaultColor: (s, a: PayloadAction<boolean>) => {
      s.isDefaultColor = a.payload;
    },
    setWithCleared: (s, a: PayloadAction<boolean>) => {
      s.withCleared = a.payload;
    },
    setWithIndeterminate: (s, a: PayloadAction<boolean>) => {
      s.withIndeterminate = a.payload;
    },
    setSelectedColorId: (s, a: PayloadAction<number | null>) => {
      s.selectedColorId = a.payload;
    },
    setIsEditColors(state, action: PayloadAction<boolean>) {
      state.isEditColors = action.payload;
    },
    setColorSliderValues: (s, a: PayloadAction<number[]>) => {
      s.colorSliderValues = a.payload;
    },
    setDefaultColor: (s, a: PayloadAction<IColorRangeModel>) => {
      s.defaultColor = a.payload;
    },
    setSeverityDirection(state, action: PayloadAction<'asc' | 'desc'>) {
      state.severityDirection = action.payload;
    },

    setCurrentTmoId: (state, action: PayloadAction<{ module: string; tmoId: number | string }>) => {
      const { module, tmoId } = action.payload;
      state.currentTmoId[module] = tmoId;
    },
    setCurrentTmoType: (state, action: PayloadAction<{ module: string; tmoType: string }>) => {
      const { module, tmoType } = action.payload;
      state.currentTmoType[module] = tmoType;
    },
    setCurrentTprm: (
      state,
      action: PayloadAction<{ module: string; tprm: TprmData | undefined }>,
    ) => {
      const { module, tprm } = action.payload;
      state.currentTprm[module] = tprm;
    },
    setIsEditPalette: (state, action: PayloadAction<{ module: string; value: boolean }>) => {
      const { module, value } = action.payload;
      state.isEditPalette[module] = value;
    },
    toggleIsOpenColorSelecting: (state, action: PayloadAction<{ module: string }>) => {
      const { module } = action.payload;
      state.isOpenColorSelecting[module] = !state.isOpenColorSelecting[module];
    },
    toggleIsOpenColorSettings: (state, action: PayloadAction<{ module: string }>) => {
      const { module } = action.payload;
      state.isOpenColorSettings[module] = !state.isOpenColorSettings[module];
    },
    setSelectedPalette: (
      state,
      action: PayloadAction<{ module: string; palette: PaletteSettings }>,
    ) => {
      const { module, palette } = action.payload;
      state.selectedPalette[module] = palette;
    },
    unsetPaletteForAModule: (state, action: PayloadAction<string>) => {
      const module = action.payload;
      const { [module]: removedModulePalette, ...rest } = state.selectedPalette;
      state.selectedPalette = rest;
    },

    setCurentPaletteIds: (
      state,
      action: PayloadAction<{
        module: string;
        tmoId: number;
        paletteId: number;
      }>,
    ) => {
      const { module, tmoId, paletteId } = action.payload;
      state.currentPaletteIds[module][tmoId] = paletteId;
    },

    restore: (_, action: PayloadAction<IInitialState>) => action.payload,
  },
});

export const colorsConfigureActions = colorsConfigureSlice.actions;
export const colorsConfigureReducer = colorsConfigureSlice.reducer;
export const colorsConfigureSliceName = colorsConfigureSlice.name;
