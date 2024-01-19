import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  startTest: "",
  viewResult: "",
};

export const buttonGroupSlice = createSlice({
  name: "buttonGroup",
  initialState,
  reducers: {
    handleStartTest: (state, action) => {
      state.startTest = action.payload;
      state.viewResult = "";
    },
    handleViewResult: (state, action) => {
      state.viewResult = action.payload;
      state.startTest = "";
    },
  },
});

export const { handleStartTest, handleViewResult } = buttonGroupSlice.actions;

export default buttonGroupSlice.reducer;

export const getButtonGroup = (state) => state.buttonGroup;
