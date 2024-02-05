import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addOptionLimit: 0,
};

export const utilsSlice = createSlice({
  name: 'questUtils',
  initialState,
  reducers: {
    updateaddOptionLimit: (state) => {
      state.addOptionLimit = state.addOptionLimit + 1;
    },
    resetaddOptionLimit: (state) => {
      state.addOptionLimit = initialState.addOptionLimit;
    },
  },
});

export const { updateaddOptionLimit, resetaddOptionLimit } = utilsSlice.actions;

export default utilsSlice.reducer;

export const getQuestUtils = (state) => state.questUtils;
