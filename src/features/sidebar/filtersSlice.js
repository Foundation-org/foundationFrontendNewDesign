import { createSlice } from '@reduxjs/toolkit';

const resetState = {
  // expandedView: false,
  searchData: '',
  filterByStatus: '',
  filterByType: '',
  filterByScope: '',
  filterBySort: 'Newest First',
  isColumns: false,
  clearFilter: false,
};

const resetOtherStates = {
  filterByStatus: '',
  filterByType: '',
  filterByScope: '',
  filterBySort: 'Newest First',
  isColumns: false,
  clearFilter: false,
};

const initialState = {
  expandedView: localStorage.getItem('expandedView') === 'true' ? true : false,
  searchData: '',
  filterByStatus: '',
  filterByType: '',
  filterByScope: '',
  filterBySort: 'Newest First',
  isColumns: JSON.parse(localStorage.getItem('columns')).Block.list.length > 0 ? true : false,
  itemsWithCross: [],
  clearFilter: false,
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleExapandedView: (state, action) => {
      state.expandedView = !state.expandedView;
    },
    setExpandedView: (state, action) => {
      state.expandedView = action.payload;
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
    setFilterByStatus: (state, action) => {
      state.filterByStatus = action.payload;
    },
    setFilterByType: (state, action) => {
      if (action.payload === 'Multiple Choice') {
        state.filterByType = 'Multiple Choise';
      } else if (action.payload === 'Ranked Choice') {
        state.filterByType = 'Ranked Choise';
      } else if (action.payload === 'Open Choice') {
        state.filterByType = 'Open Choice';
      } else {
        state.filterByType = action.payload;
      }
    },
    setFilterByScope: (state, action) => {
      state.filterByScope = action.payload;
    },
    setFilterBySort: (state, action) => {
      state.filterBySort = action.payload;
    },
    setItemWithCross: (state, action) => {
      state.itemsWithCross = action.payload;
    },
    setIsColumn: (state, action) => {
      if (JSON.parse(localStorage.getItem('columns')).Block.list.length > 0) {
        state.isColumns = true;
      } else {
        state.isColumns = false;
      }
    },
    resetFilters: (state) => {
      const stateString = JSON.stringify({
        All: {
          id: 'All',
          list: [],
        },
        Block: {
          id: 'Block',
          list: [],
        },
      });
      localStorage.setItem('columns', stateString);
      // localStorage.removeItem('columns');
      Object.assign(state, resetState);
    },
    resetSearchData: (state) => {
      state.searchData = '';
    },
    resetOtherFilters: (state) => {
      const stateString = JSON.stringify({
        All: {
          id: 'All',
          list: [],
        },
        Block: {
          id: 'Block',
          list: [],
        },
      });
      localStorage.setItem('columns', stateString);
      // localStorage.removeItem('columns');
      Object.assign(state, resetOtherStates);
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
  setItemWithCross,
  setIsColumn,
  resetFilters,
  resetSearchData,
  resetOtherFilters,
  setExpandedView,
} = filtersSlice.actions;

export default filtersSlice.reducer;

export const getFilters = (state) => state.filters;
