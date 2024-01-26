import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  yesNo: {
    question: '',
    changedOption: '',
    changeState: false,
  },
  agreeDisagree: {
    question: '',
    changedOption: '',
    changeState: false,
  },
  likeDislike: {
    question: '',
    changedOption: '',
    changeState: false,
  },
  multipleChoice: {
    question: '',
    changedOption: '',
    changeState: false,

    multipleOption: false,
    addOption: false,
    optionsCount: 3,
    options: [],
  },
  rankedChoice: {
    question: '',
    changedOption: '',
    changeState: false,
    addOption: false,
    optionsCount: 3,
    options: [],
  },
};

export const createQuestSlice = createSlice({
  name: 'createQuest',
  initialState,
  reducers: {
    updateYesNo: (state, action) => {
      state.yesNo = { ...action.payload };
    },
    updateAgreeDisagree: (state, action) => {
      state.agreeDisagree = { ...action.payload };
    },
    updateLikeDislike: (state, action) => {
      state.likeDislike = { ...action.payload }
    },
    updateMultipleChoice: (state, action) => {
      state.multipleChoice = { ...action.payload }
    },
    updateRankedChoice: (state, action) => {
      state.rankedChoice = { ...action.payload }
    },
    resetCreateQuest: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  updateYesNo,
  resetCreateQuest,
  updateAgreeDisagree,
  updateLikeDislike,
  updateMultipleChoice,
  updateRankedChoice } = createQuestSlice.actions;

export default createQuestSlice.reducer;

export const getYesNo = (state) => state.createQuest.yesNo;
export const getAgreeDisagree = (state) => state.createQuest.agreeDisagree;
export const getLikeDislike = (state) => state.createQuest.likeDislike;
export const getMultipleChoice = (state) => state.createQuest.multipleChoice;
export const getRankChoice = (state) => state.createQuest.rankedChoice;
