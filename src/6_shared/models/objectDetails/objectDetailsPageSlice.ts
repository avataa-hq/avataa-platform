import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import { OBJECT_ID_STACK_KEY } from './constants';

interface State {
  objectIdsStack: number[];
}

const initialState: State = {
  objectIdsStack: [],
};

const objectDetailsPageSlice = createSlice({
  name: 'objectDetailsPage',
  initialState,
  reducers: {
    setObjectIdsStack: (state, { payload }: PayloadAction<State['objectIdsStack']>) => {
      state.objectIdsStack = payload;

      if (payload.length) {
        localStorage.setItem(OBJECT_ID_STACK_KEY, JSON.stringify(payload));
      } else {
        localStorage.removeItem(OBJECT_ID_STACK_KEY);
      }
    },
    pushObjectIdToStack: (state, { payload }: PayloadAction<State['objectIdsStack'][number]>) => {
      state.objectIdsStack.push(payload);

      const curentState = current(state);
      if (curentState.objectIdsStack.length) {
        localStorage.setItem(OBJECT_ID_STACK_KEY, JSON.stringify(curentState.objectIdsStack));
      } else {
        localStorage.removeItem(OBJECT_ID_STACK_KEY);
      }
    },
    popObjectIdFromStack: (state) => {
      state.objectIdsStack.pop();

      const curentState = current(state);
      if (curentState.objectIdsStack.length) {
        localStorage.setItem(OBJECT_ID_STACK_KEY, JSON.stringify(curentState.objectIdsStack));
      } else {
        localStorage.removeItem(OBJECT_ID_STACK_KEY);
      }
    },
    restore: (_, action: PayloadAction<State>) => action.payload,
  },
});

export const objectDetailsPageActions = objectDetailsPageSlice.actions;
export const objectDetailsPageReducer = objectDetailsPageSlice.reducer;
export const objectDetailsPageSliceName = objectDetailsPageSlice.name;
