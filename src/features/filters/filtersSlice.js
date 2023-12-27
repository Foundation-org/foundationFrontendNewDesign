import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  preferences:"",
  filterByStatus: "",
  filterByType: "",
  filterByScope: "",
  filterBySort: "Newest First",
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setPreferences:(state, action) => {
      state.preferences = action.payload;
    },
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
  setSearch,
  setPreferences,
  setFilterByStatus,
  setFilterByType,
  setFilterByScope,
  setFilterBySort,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;

export const getFilters = (state) => state.filters;
