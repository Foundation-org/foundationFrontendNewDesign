import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  yesNo: {
    question: '',
    changeChoice: '',
  },
  agreeDisagree: {
    question: '',
    changeChoice: '',
  },
  likeDislike: {
    question: '',
    changeChoice: '',
  },
  multipleChoice: {
    question: '',
    options: [],
    selectMultiple: false,
    addOption: false,
    changeChoice: '',
  },
  rankedChoice: {
    question: '',
    options: [],
    addOption: false,
    changeChoice: '',
  },
};

export const createQuestSlice = createSlice({
  name: 'createQuest',
  initialState,
  reducers: {
    updateYesNo: (state, action) => {
      state.yesNo = { ...action.payload };
    },
    resetCreateQuest: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateYesNo, resetCreateQuest } = createQuestSlice.actions;

export default createQuestSlice.reducer;

export const getYesNo = (state) => state.createQuest.yesNo;
export const getAgreeDisagree = (state) => state.createQuest.agreeDisagree;
export const getLikeDislike = (state) => state.createQuest.likeDislike;
export const getMultipleChoice = (state) => state.createQuest.multipleChoice;
export const getRankChoice = (state) => state.createQuest.rankedChoice;
