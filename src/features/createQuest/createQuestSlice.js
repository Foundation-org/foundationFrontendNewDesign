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
    toggleExapandedView: (state, action) => {
      state.expandedView = !state.expandedView;
    },
    resetFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { toggleExapandedView, resetFilters } = createQuestSlice.actions;

export default createQuestSlice.reducer;

export const getYesNo = (state) => state.createQuest.yesNo;
// export const getYesNo = (state) => state.createQuest.yesNo;
// export const getYesNo = (state) => state.createQuest.yesNo;
// export const getYesNo = (state) => state.createQuest.yesNo;
// export const getYesNo = (state) => state.createQuest.yesNo;
