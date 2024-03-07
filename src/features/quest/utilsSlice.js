import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addOptionLimit: 0,
  hiddenPosts: [],
  sharedLinkPost: null,
  hiddenPostId: null,
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
    addSharedLinkPost: (state, action) => {
      state.sharedLinkPost = action.payload;
    },
    addHiddenPostId: (state, action) => {
      state.hiddenPostId = action.payload;
    },
  },
});

export const {
  updateaddOptionLimit,
  resetaddOptionLimit,
  addHiddenPosts,
  removeHiddenPosts,
  addSharedLinkPost,
  addHiddenPostId,
} = utilsSlice.actions;

export default utilsSlice.reducer;

export const getQuestUtils = (state) => state.questUtils;
