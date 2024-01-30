import * as questServices from '../../services/api/questsApi'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const checkQuestion = createAsyncThunk('createQuest/checkQuestion', async (value) => {
  const result = await questServices.questionValidation({
    question: value,
    queryType: 'yes/no',
  });
  return result;

});

const initialState = {
  questions: {
    question: '',
    changedOption: '',
    changeState: false,
    multipleOption: false,
    addOption: false,
    optionsCount: 3,
    options: [],
  },
  questionReset: {
    name: 'Ok',
    color: 'text-[#389CE3]',
    tooltipName: 'Please write something...',
    tooltipStyle: 'tooltip-info',
    status : false
  }
};

export const createQuestSlice = createSlice({
  name: 'createQuest',
  initialState,
  reducers: {
    updateQuestion: (state, action) => {
      const { question, changedOption, changeState } = action.payload;
      return { ...state, questions: { ...state.questions, question, changedOption, changeState } };
    },

    updateMultipleChoice: (state, action) => {
      const { question, changedOption, changeState, multipleOption, addOption, optionsCount, options } = action.payload;
      return { ...state, questions: { ...state.questions, question, changedOption, changeState, multipleOption, addOption, optionsCount, options } };
    },
    updateRankedChoice: (state, action) => {
      const { question, changedOption, changeState, addOption, optionsCount, options } = action.payload;
      return { ...state, questions: { ...state.questions, question, changedOption, changeState, addOption, optionsCount, options } };
    },
    // checkQuestion: (state, action) => {
    //   const { type } = action.payload
    //   console.log("question value is", type);
    //   if (type === "Checking") {
    //     state.questionReset = {
    //       name: 'Checking',
    //       color: 'text-[#0FB063]',
    //       tooltipName: 'Verifying your question. Please wait...',
    //       tooltipStyle: 'tooltip-success',
    //     }
    //   }
    // },
    resetCreateQuest: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkQuestion.pending, (state, action) => {
      state.questionReset = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status : true
      }
    })
    builder.addCase(checkQuestion.fulfilled, (state, action) => {

      const { validatedQuestion, errorMessage } = action.payload
      if (errorMessage) {
        state.questionReset = {
          name: 'Rejected',
          color: 'text-[#b00f0f]',
          tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
          tooltipStyle: 'tooltip-error',
          status : true
        }
      }
      else {
        state.questions.question = validatedQuestion;
        state.questionReset = {
          name: 'Ok',
          color: 'text-[#0FB063]',
          tooltipName: 'Question is Verified',
          tooltipStyle: 'tooltip-success',
          isVerifiedQuestion: true,
          status : false
        }
      }

    })
    builder.addCase(checkQuestion.rejected, (state, action) => {
      state.questionReset = {
        name: 'Rejected',
        color: 'text-[#b00f0f]',
        tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
        tooltipStyle: 'tooltip-error',
      }
    });
  },
});

export const { updateQuestion, resetCreateQuest, updateMultipleChoice, updateRankedChoice } = createQuestSlice.actions;

export default createQuestSlice.reducer;

export const getCreate = (state) => state.createQuest.questions;
export const questionStatus = (state) => state.createQuest.questionReset;
