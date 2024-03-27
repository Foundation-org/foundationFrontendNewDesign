import { createSlice } from '@reduxjs/toolkit';

const topicsInitialState = {
  All: {
    id: 'All',
    list: [],
  },
  Block: {
    id: 'Block',
    list: [],
  },
};

const resetState = {
  expandedView: true,
  searchData: '',
  filterByStatus: '',
  filterByType: '',
  filterByScope: '',
  filterBySort: 'Newest First',
  clearFilter: false,
};

const resetOtherStates = {
  filterByStatus: '',
  filterByType: '',
  filterByScope: '',
  filterBySort: 'Newest First',
  clearFilter: false,
};

const initialState = {
  expandedView: true,
  searchData: '',
  filterByStatus: '',
  filterByType: '',
  filterByScope: '',
  filterBySort: 'Newest First',
  topics: topicsInitialState,
  moderationRatingFilter: {
    initial: 0,
    final: 0,
  },
  clearFilter: false,
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setTopics: (state, action) => {
      return {
        ...state,
        topics: {
          ...state.topics,
          All: { id: 'All', list: action.payload },
          Block:
            state.topics?.Block && state.topics?.Block.list?.length > 0
              ? { id: 'Block', list: state.topics?.Block.list }
              : { id: 'Block', list: [] },
        },
      };
    },
    setBlockTopics: (state, action) => {
      state.topics.Block = { id: 'Block', list: action.payload };
    },
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
    setRatings: (state, action) => {
      const { initial, final } = action.payload;
      state.moderationRatingFilter = { initial, final };
    },
    resetFilters: (state) => {
      localStorage.setItem('selectedButtonId', 'newButton');
      state.topics.Block = { id: 'Block', list: [] };
      Object.assign(state, resetState);
    },
    resetSearchData: (state) => {
      state.searchData = '';
    },
    resetOtherFilters: (state) => {
      localStorage.setItem('selectedButtonId', 'newButton');
      state.topics.Block = { id: 'Block', list: [] };
      Object.assign(state, resetOtherStates);
    },
  },
});

export const {
  setTopics,
  setBlockTopics,
  toggleExapandedView,
  setSearchData,
  setFilterByStatus,
  setFilterByType,
  setFilterByScope,
  setFilterBySort,
  setRatings,
  resetFilters,
  resetSearchData,
  resetOtherFilters,
  setExpandedView,
} = filtersSlice.actions;

export default filtersSlice.reducer;

export const getFilters = (state) => state.filters;
