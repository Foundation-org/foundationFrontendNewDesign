import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  optionLimit: 0,
};

export const utilsSlice = createSlice({
  name: "questUtils",
  initialState,
  reducers: {
    updateOptionLimit: (state) => {
      state.optionLimit = state.optionLimit + 1;
    },
    resetOptionLimit: (state) => {
      state.optionLimit = initialState.optionLimit;
    },
  },
});

export const { updateOptionLimit, resetOptionLimit } = utilsSlice.actions;

export default utilsSlice.reducer;

export const getQuestUtils = (state) => state.questUtils;
