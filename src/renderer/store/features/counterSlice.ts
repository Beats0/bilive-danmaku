import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { counterStateType } from '../../reducers/types';

const initialState: counterStateType = {
  count: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state, { payload }) {
      state.count += payload.step;
    },
    decrement(state) {
      state.count -= 1;
    },
  },
});

export const asyncIncrement = (payload) => (dispatch) => {
  setTimeout(() => {
    dispatch(increment(payload));
  }, 2000);
};

export const { increment, decrement } = counterSlice.actions;
export const selectCounter = (state: RootState) => state.counter;
export default counterSlice.reducer;
