import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  page: string;
  pageState: Record<string, any>;
  components: string[];
  componentsState: Record<string, any>;
}

const initialState: IInitialState = {
  page: '',
  pageState: {},
  components: [],
  componentsState: {},
};

const shareStateSlice = createSlice({
  name: 'shareState',
  initialState,
  reducers: {
    pageRegistration: (s, { payload }: PayloadAction<string>) => {
      s.page = payload;
    },
    componentsRegistration: (s, { payload }: PayloadAction<string[] | string>) => {
      if (Array.isArray(payload)) {
        payload.forEach((component) => {
          if (!s.components.includes(component)) {
            s.components.push(component);
            s.componentsState[component] = null;
          }
        });
      } else if (!s.components.includes(payload)) {
        s.components.push(payload);
        s.componentsState[payload] = null;
      }
    },
    componentsUnRegistration: (s, { payload }: PayloadAction<string | string[]>) => {
      if (Array.isArray(payload)) {
        s.components = s.components.filter((c) => !payload.includes(c));
        payload.forEach((comp) => {
          if (s.componentsState[comp]) delete s.componentsState[comp];
        });
      } else {
        s.components = s.components.filter((c) => c !== payload);
        if (s.componentsState[payload]) delete s.componentsState[payload];
      }
    },
  },
});

export const shareStateActions = shareStateSlice.actions;
export const shareStateReducer = shareStateSlice.reducer;
export const shareStateSliceName = shareStateSlice.name;
