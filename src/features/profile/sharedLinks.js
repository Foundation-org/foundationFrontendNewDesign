import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filterStates: {
    filterBySort: 'Newest First',
    filterByType: '',
    searchData: '',
  },
};

export const sharedLinksSlice = createSlice({
  name: 'sharedLinks',
  initialState,
  reducers: {
    updateSearch: (state, action) => {
      state.filterStates.searchData = action.payload;
    },
  },
});

export const { updateSearch } = sharedLinksSlice.actions;

export default sharedLinksSlice.reducer;

export const sharedLinksFilters = (state) => state.sharedLinks.filterStates;
