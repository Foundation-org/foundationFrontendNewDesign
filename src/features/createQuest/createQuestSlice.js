import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  question: '',
  changedOption: 'Anytime',
  changeState: false,
  multipleOption: false,
  addOption: false,
  optionsCount: 3,
  options: [],
};

export const createQuestSlice = createSlice({
  name: 'createQuest',
  initialState,
  reducers: {
    updateQuestion: (state, action) => {
      const { question, changedOption, changeState } = action.payload;
      return { ...state, question, changedOption, changeState }
    },

    updateMultipleChoice: (state, action) => {
      const { qustion, changedOption, changeState, multipleOption, addOption, optionsCount, options } = action.payload;
      return { ...state, qustion, changedOption, changeState, multipleOption, addOption, optionsCount, options }
    },
    updateRankedChoice: (state, action) => {
      const { question, changedOption, changeState, addOption, optionsCount, options } = action.payload;
      return { ...state, question, changedOption, changeState, addOption, optionsCount, options }
    },
    resetCreateQuest: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  updateQuestion,
  resetCreateQuest,
  updateMultipleChoice,
  updateRankedChoice } = createQuestSlice.actions;

export default createQuestSlice.reducer;

export const getCreate = (state) => state.createQuest;

