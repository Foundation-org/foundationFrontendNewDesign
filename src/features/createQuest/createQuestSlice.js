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
    changedOption: 'Anytime',
    changeState: true,
    multipleOption: false,
    addOption: true,
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
  chatgptStatus: {
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
      chatgptOptionStatus: {
        name: 'Ok',
        color: 'text-[#389CE3]',
        tooltipName: 'Please write something...',
        tooltipStyle: 'tooltip-info',
      },
      isTyping: true,
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
      chatgptOptionStatus: {
        name: 'Ok',
        color: 'text-[#389CE3]',
        tooltipName: 'Please write something...',
        tooltipStyle: 'tooltip-info',
      },
      isTyping: true,
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
      chatgptOptionStatus: {
        name: 'Ok',
        color: 'text-[#389CE3]',
        tooltipName: 'Please write something...',
        tooltipStyle: 'tooltip-info',
      },
      isTyping: true,
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
      return {
        ...state,
        questions: { ...state.questions, question, changedOption, changeState },
        // questionReset: initialState.questionReset,
      };
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
        // questionReset: initialState.questionReset,
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
        isTyping: true,
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
    handleQuestionReset: (state, action) => {
      return {
        ...state,
        questions: action.payload,
        questionReset: initialState.questionReset,
      };
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
      state.chatgptStatus = {
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
          state.chatgptStatus = {
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
          state.chatgptStatus = {
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
        state.chatgptStatus = {
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
      state.chatgptStatus = {
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
              chatgptOptionStatus: {
                name: 'Checking',
                color: 'text-[#0FB063]',
                tooltipName: 'Verifying your answer. Please wait...',
                tooltipStyle: 'tooltip-success',
              },
              isTyping: false,
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
                  chatgptOptionStatus: {
                    name: 'Duplicate',
                    color: 'text-[#EFD700]',
                    tooltipName: 'Found Duplication!',
                    tooltipStyle: 'tooltip-error',
                    duplication: true,
                  },
                  isTyping: false,
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
                  chatgptOptionStatus: {
                    name: 'Ok',
                    color: 'text-[#0FB063]',
                    tooltipName: 'Answer is Verified',
                    tooltipStyle: 'tooltip-success',
                  },
                  isTyping: false,
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
                chatgptOptionStatus: {
                  name: 'Rejected',
                  color: 'text-[#b00f0f]',
                  tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
                  tooltipStyle: 'tooltip-error',
                },
                isTyping: false,
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
  handleQuestionReset,
  addNewOption,
  delOption,
  drapAddDrop,
  handleChangeOption,
} = createQuestSlice.actions;

export default createQuestSlice.reducer;

export const getCreate = (state) => state.createQuest.questions;
export const questionStatus = (state) => state.createQuest.questionReset;
export const questionChatgptStatus = (state) => state.createQuest.chatgptStatus;
export const optionsValue = (state) => state.createQuest.optionsValue;
