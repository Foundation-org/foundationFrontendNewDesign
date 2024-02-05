import * as questServices from '../../services/api/questsApi';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkAnswerExistCreateQuest } from '../../services/api/questsApi';

export const checkQuestion = createAsyncThunk('createQuest/checkQuestion', async (value) => {
  const result = await questServices.questionValidation({
    question: value,
    queryType: 'yes/no',
  });
  return result;
});

export const checkAnswer = createAsyncThunk('createQuest/checkAnswer', async ({ id, value, index }) => {
  const result = await questServices.answerValidation({
    answer: value,
  });
  return { id, result, index };
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
    status: false,
  },
  optionsValue: [
    {
      id: 'index-0',
      question: '',
      selected: false,
      optionStatus: {
        name: 'Ok',
        color: 'text-[#389CE3]',
        tooltipName: 'Please write something...',
        tooltipStyle: 'tooltip-info',
      },
    },
    {
      id: 'index-1',
      question: '',
      selected: false,
      optionStatus: {
        name: 'Ok',
        color: 'text-[#389CE3]',
        tooltipName: 'Please write something...',
        tooltipStyle: 'tooltip-info',
      },
    },
    {
      selected: false,
      id: 'index-2',
      question: '',
      optionStatus: {
        name: 'Ok',
        color: 'text-[#389CE3]',
        tooltipName: 'Please write something...',
        tooltipStyle: 'tooltip-info',
      },
    },
  ],
  optionslength: 3,
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
      return {
        ...state,
        questions: {
          ...state.questions,
          question,
          changedOption,
          changeState,
          multipleOption,
          addOption,
          optionsCount,
          options,
        },
      };
    },
    updateRankedChoice: (state, action) => {
      const { question, changedOption, changeState, addOption, optionsCount, options } = action.payload;
      return {
        ...state,
        questions: { ...state.questions, question, changedOption, changeState, addOption, optionsCount, options },
      };
    },
    addNewOption: (state, action) => {
      const newOption = {
        id: `index-${state.optionslength}`,
        question: '',
        selected: false,
        optionStatus: {
          name: 'Ok',
          color: 'text-[#389CE3]',
          tooltipName: 'Please write something...',
          tooltipStyle: 'tooltip-info',
        },
      };
      state.optionsValue.push(newOption);
      state.optionslength += 1;
    },
    delOption: (state, action) => {
      const tempOptions = state.optionsValue.filter((value) => value.id !== action.payload.id);
      state.optionsValue = tempOptions;
    },
    drapAddDrop: (state, action) => {
      state.optionsValue = action.payload.newTypedValues;
    },
    handleChangeOption: (state, action) => {
      state.optionsValue = action.payload.newTypedValues;
    },
    resetCreateQuest: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    // check question status start
    builder.addCase(checkQuestion.pending, (state, action) => {
      state.questionReset = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
      };
    });
    builder.addCase(checkQuestion.fulfilled, (state, action) => {
      const { validatedQuestion, errorMessage } = action.payload;
      if (errorMessage) {
        if (errorMessage === 'DUPLICATION') {
          state.questions.question = validatedQuestion;
          state.questionReset = {
            name: 'Duplicate',
            color: 'text-[#EFD700]',
            tooltipName: 'This post is not unique. A post like this already exists.',
            tooltipStyle: 'tooltip-error',
            duplication: true,
          };
        } else {
          state.questionReset = {
            name: 'Rejected',
            color: 'text-[#b00f0f]',
            tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
            tooltipStyle: 'tooltip-error',
            status: true,
          };
        }
      } else {
        state.questions.question = validatedQuestion;
        state.questionReset = {
          name: 'Ok',
          color: 'text-[#0FB063]',
          tooltipName: 'Question is Verified',
          tooltipStyle: 'tooltip-success',
          isVerifiedQuestion: true,
          status: false,
        };
      }
    });
    builder.addCase(checkQuestion.rejected, (state, action) => {
      state.questionReset = {
        name: 'Rejected',
        color: 'text-[#b00f0f]',
        tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
        tooltipStyle: 'tooltip-error',
      };
    });

    // check answer status start
    builder.addCase(checkAnswer.pending, (state, action) => {
      const { id, value } = action.meta.arg;

      const tempOptions = state.optionsValue.map((option) => {
        return option.id === id
          ? {
              ...option,
              question: value,
              optionStatus: {
                name: 'Checking',
                color: 'text-[#0FB063]',
                tooltipName: 'Verifying your answer. Please wait...',
                tooltipStyle: 'tooltip-success',
              },
            }
          : option;
      });
      state.optionsValue = tempOptions;
    });
    builder.addCase(checkAnswer.fulfilled, (state, action) => {
      const { id, result, index } = action.payload;
      // console.log("our result is", result);

      if (result.validatedAnswer) {
        let answerExist = checkAnswerExistCreateQuest({
          answersArray: JSON.parse(JSON.stringify(state.optionsValue)),
          answer: result.validatedAnswer,
          index,
        });

        if (answerExist) {
          const tempOptions = state.optionsValue.map((option) => {
            return option.id === id
              ? {
                  ...option,
                  question: result.validatedAnswer,
                  optionStatus: {
                    name: 'Duplicate',
                    color: 'text-[#EFD700]',
                    tooltipName: 'Found Duplication!',
                    tooltipStyle: 'tooltip-error',
                    duplication: true,
                  },
                }
              : option;
          });
          state.optionsValue = tempOptions;
        } else {
          const tempOptions = state.optionsValue.map((option) => {
            return option.id === id
              ? {
                  ...option,
                  question: result.validatedAnswer,
                  optionStatus: {
                    name: 'Ok',
                    color: 'text-[#0FB063]',
                    tooltipName: 'Answer is Verified',
                    tooltipStyle: 'tooltip-success',
                  },
                }
              : option;
          });
          state.optionsValue = tempOptions;
        }
      } else {
        const tempOptions = state.optionsValue.map((option) => {
          return option.id === id
            ? {
                ...option,
                optionStatus: {
                  name: 'Rejected',
                  color: 'text-[#b00f0f]',
                  tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
                  tooltipStyle: 'tooltip-error',
                },
              }
            : option;
        });
        state.optionsValue = tempOptions;
      }
    });
  },
});

export const {
  updateQuestion,
  updateMultipleChoice,
  updateRankedChoice,
  resetCreateQuest,
  addNewOption,
  delOption,
  drapAddDrop,
  handleChangeOption,
} = createQuestSlice.actions;

export default createQuestSlice.reducer;

export const getCreate = (state) => state.createQuest.questions;
export const questionStatus = (state) => state.createQuest.questionReset;
export const optionsValue = (state) => state.createQuest.optionsValue;
