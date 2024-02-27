import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addOptionLimit: 0,
  hiddenPosts: [],
};

export const utilsSlice = createSlice({
  name: 'questUtils',
  initialState,
  reducers: {
    updateaddOptionLimit: (state) => {
      state.addOptionLimit = state.addOptionLimit + 1;
    },
    resetaddOptionLimit: (state) => {
      state.addOptionLimit = initialState.addOptionLimit;
    },
    addHiddenPosts: (state, action) => {
      state.hiddenPosts.push(action.payload);
    },
    removeHiddenPosts: (state, action) => {
      state.hiddenPosts = state.hiddenPosts.filter((item) => item !== action.payload);
    },
  },
});

export const { updateaddOptionLimit, resetaddOptionLimit, addHiddenPosts, removeHiddenPosts } = utilsSlice.actions;

export default utilsSlice.reducer;

export const getQuestUtils = (state) => state.questUtils;
