import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  answered: false,
  changeAble: false,
  addOption: false,
  start: false,
  change: false,
  result: false,
};

export const buttonGroupSlice = createSlice({
  name: "buttonGroup",
  initialState,
  reducers: {
    setQuestAnswered: (state, action) => {
      state.answered = action.payload;
    },
    setQuestChangeable: (state, action) => {
      state.changeAble = action.payload;
    },
    setQuestAddOption: (state, action) => {
      state.addOption = action.payload;
    },
    setQuestStart: (state, action) => {
      state.start = action.payload;
    },
    setQuestChange: (state, action) => {
      state.change = action.payload;
    },
    setQuestResult: (state, action) => {
      state.result = action.payload;
    },
  },
});

export const {
  setQuestAnswered,
  setQuestChangeable,
  setQuestAddOption,
  setQuestStart,
  setQuestChange,
  setQuestResult,
} = buttonGroupSlice.actions;

export default buttonGroupSlice.reducer;

export const getButtonGroup = (state) => state.buttonGroup;
