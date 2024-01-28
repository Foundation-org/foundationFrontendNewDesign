import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  columnSize: 0,
};

export const ledgerSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {
    updateColumnSize: (state, action) => {
      state.columnSize = action.payload;
      //   const { columnSize } = action.payload;
      //   return { ...state, columnSize };
    },
    resetCreateQuest: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateColumnSize, resetCreateQuest } = ledgerSlice.actions;

export default ledgerSlice.reducer;

export const getLedger = (state) => state.ledger;
