import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sharedQuestStatus: {
    type: null,
    isDialogueBox: false,
    link: null,
    id: null,
  },
  isDialogueBox: false,
  addOptionLimit: 0,
  hiddenPosts: [],
  sharedLinkPost: null,
  hiddenPostId: null,
  DisabledPostId: null,
  enablePostId: null,
};

export const utilsSlice = createSlice({
  name: 'questUtils',
  initialState,
  reducers: {
    updateDialogueBox: (state, action) => {
      const { type, status, link, id } = action.payload;
      state.sharedQuestStatus.type = type;
      state.sharedQuestStatus.isDialogueBox = status;
      state.sharedQuestStatus.link = link;
      state.sharedQuestStatus.id = id;
    },
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
    addDisabledPostId: (state, action) => {
      state.DisabledPostId = action.payload;
    },
    addEnablePostId: (state, action) => {
      state.enablePostId = action.payload;
    },
  },
});

export const {
  updateDialogueBox,
  updateaddOptionLimit,
  resetaddOptionLimit,
  addHiddenPosts,
  removeHiddenPosts,
  addSharedLinkPost,
  addHiddenPostId,
  addDisabledPostId,
  addEnablePostId,
} = utilsSlice.actions;

export default utilsSlice.reducer;

export const getQuestUtils = (state) => state.questUtils;
