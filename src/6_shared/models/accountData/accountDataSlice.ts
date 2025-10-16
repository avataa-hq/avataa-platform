import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from './types';

const initialState: Account = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  attributes: {},
};

const accountDataSlice = createSlice({
  name: 'accountData',
  initialState,
  reducers: {
    setAccountData: (_, action: PayloadAction<Account>) => action.payload,
  },
});

export const accountDataActions = accountDataSlice.actions;
export const accountDataReducer = accountDataSlice.reducer;
export const accountDataSliceName = accountDataSlice.name;
