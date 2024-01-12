import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expandedView: localStorage.getItem("expandedView") === "true" ? true : false,
  searchData: "",
  filterByStatus: "",
  filterByType: "",
  filterByScope: "",
  filterBySort: "Newest First",
  clearFilter: false,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleExapandedView: (state, action) => {
      state.expandedView = !state.expandedView;
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
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
  toggleExapandedView,
  setSearchData,
  setFilterByStatus,
  setFilterByType,
  setFilterByScope,
  setFilterBySort,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;

export const getFilters = (state) => state.filters;
