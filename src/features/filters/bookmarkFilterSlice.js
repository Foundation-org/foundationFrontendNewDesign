import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterByStatus: "",
  filterByType: "",
  filterByScope: "",
  filterBySort: "Newest First",
};

export const bookmarkFiltersSlice = createSlice({
  name: "bookmarkFilters",
  initialState,
  reducers: {
    setFilterByStatus: (state, action) => {
      state.filterByStatus = action.payload;
    },
    setFilterByType: (state, action) => {
      state.filterByType = action.payload;
    },
    setFilterByScope: (state, action) => {
      state.filterByScope = action.payload;
    },
    setFilterBySort: (state, action) => {
      state.filterBySort = action.payload;
    },
    resetFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setFilterByStatus,
  setFilterByType,
  setFilterByScope,
  setFilterBySort,
  resetFilters,
} = bookmarkFiltersSlice.actions;

export default bookmarkFiltersSlice.reducer;

export const getFilters = (state) => state.bookmarkFilters;
