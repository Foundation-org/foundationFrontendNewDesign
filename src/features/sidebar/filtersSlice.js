import { createSlice } from '@reduxjs/toolkit';

const initialColumns = {
  All: {
    id: 'All',
    list: [],
  },
  Preferences: {
    id: 'Preferences',
    list: [],
  },
  Block: {
    id: 'Block',
    list: [],
  },
};
const resetState = {
  // expandedView: false,
  searchData: '',
  filterByStatus: '',
  filterByType: '',
  filterByScope: '',
  filterBySort: 'Newest First',
  columns: initialColumns,
  clearFilter: false,
};

const initialState = {
  expandedView: localStorage.getItem('expandedView') === 'true' ? true : false,
  searchData: '',
  filterByStatus: '',
  filterByType: '',
  filterByScope: '',
  filterBySort: 'Newest First',
  columns: initialColumns,
  clearFilter: false,
};

export const filtersSlice = createSlice({
  name: 'filters',
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
      if (action.payload === 'Multiple Choice') {
        state.filterByType = 'Multiple Choise';
      } else if (action.payload === 'Ranked Choice') {
        state.filterByType = 'Ranked Choise';
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
    setAllColumn: (state, action) => {
      const newList = action.payload?.data.data || [];

      const filteredList = newList?.filter(
        (item) => !state.columns.Block.list.includes(item) && !state.columns.Preferences.list.includes(item),
      );

      state.columns.All = {
        ...state.columns.All,
        list: filteredList,
      };
    },
    setColumns: (state, action) => {
      if (action.payload.check === true) {
        state.columns = {
          ...state.columns,
          [action.payload.newColId.id]: action.payload.newCol.list,
        };
      } else {
        state.columns = {
          ...state.columns,
          [action.payload.newStartColId.id]: action.payload.newStartCol.list,
          [action.payload.newEndColId.id]: action.payload.newEndCol.list,
        };
      }
    },
    resetFilters: (state) => {
      Object.assign(state, resetState);
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
  setAllColumn,
  setColumns,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;

export const getFilters = (state) => state.filters;
