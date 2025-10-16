import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ITab = {
  // title: string;
  value: string;
};

interface ITabs {
  tabs: string[];
  adminTabs: string[];
  selectedTab: string;
  selectedAdminTab: string;
  defaultTab: string;
  isGlobalSearchOpen: boolean;
  activeTabs: string[];
}

const initialState: ITabs = {
  tabs: [],
  adminTabs: ['adminMain'],
  selectedTab: 'main',
  selectedAdminTab: 'adminMain',
  defaultTab: 'main',
  isGlobalSearchOpen: false,
  activeTabs: [],
};

const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab(state, action: PayloadAction<ITab>) {
      if (action.payload.value === 'main') return;
      if (state.tabs.length === 0 || state.tabs.every((item) => item !== action.payload.value)) {
        state.tabs.push(action.payload.value);
        state.selectedTab = action.payload.value;
      } else {
        state.selectedTab = action.payload.value;
      }
    },
    addAdminTab(state, action: PayloadAction<ITab>) {
      if (
        state.adminTabs.length === 0 ||
        state.adminTabs.every((item) => item !== action.payload.value)
      ) {
        state.adminTabs.push(action.payload.value);
        state.selectedAdminTab = action.payload.value;
      } else {
        state.selectedAdminTab = action.payload.value;
      }
    },
    closeTab(state, action: PayloadAction<string>) {
      let closeTabIndex;
      // eslint-disable-next-line no-return-assign
      state.tabs.forEach((item, index) =>
        item === action.payload ? (closeTabIndex = index) : null,
      );
      state.tabs = state.tabs.filter((item) => item !== action.payload);
      if (closeTabIndex !== undefined) {
        if (state.selectedTab === action.payload && state.tabs.length > 0) {
          if (closeTabIndex === state.tabs.length) {
            state.selectedTab = state.tabs[state.tabs.length - 1];
          } else if (closeTabIndex < state.tabs.length && state.tabs.length !== 0) {
            state.selectedTab = state.tabs[closeTabIndex];
          } else {
            state.selectedTab = 'main';
          }
        }
        if (state.selectedTab === action.payload && state.tabs.length === 0) {
          state.selectedTab = 'main';
        }
      }
    },
    closeAdminTab(state, action: PayloadAction<string>) {
      let closeTabIndex;
      // eslint-disable-next-line no-return-assign
      state.adminTabs.forEach((item, index) =>
        item === action.payload ? (closeTabIndex = index) : null,
      );
      state.adminTabs = state.adminTabs.filter((item) => item !== action.payload);
      if (closeTabIndex !== undefined) {
        if (state.selectedAdminTab === action.payload && state.adminTabs.length > 0) {
          if (closeTabIndex === state.adminTabs.length) {
            state.selectedAdminTab = state.adminTabs[state.adminTabs.length - 1];
          } else if (closeTabIndex < state.adminTabs.length && state.adminTabs.length !== 0) {
            state.selectedAdminTab = state.adminTabs[closeTabIndex];
          } else {
            state.selectedAdminTab = 'adminMain';
          }
        }
        if (state.selectedAdminTab === action.payload && state.adminTabs.length === 0) {
          state.selectedAdminTab = 'adminMain';
        }
      }
    },
    setSelectedTab(state, action: PayloadAction<string>) {
      state.selectedTab = action.payload;
    },
    setSelectedAdminTab(state, action: PayloadAction<string>) {
      state.selectedAdminTab = action.payload;
    },
    setDefaultTab(state, action: PayloadAction<string>) {
      state.defaultTab = action.payload;
    },
    setIsGlobalSearchOpen(state, action: PayloadAction<boolean>) {
      state.isGlobalSearchOpen = action.payload;
    },
    setActiveTabs(state, action: PayloadAction<string[]>) {
      state.activeTabs = action.payload;
    },
    restore: (_, action: PayloadAction<ITabs>) => action.payload,
  },
});

export const tabsActions = tabSlice.actions;
export const tabsReducer = tabSlice.reducer;
export const tabsSliceName = tabSlice.name;
