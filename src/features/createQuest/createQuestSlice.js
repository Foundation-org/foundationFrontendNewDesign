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

const defaultStatus = {
  name: 'Ok',
  color: 'text-[#389CE3]',
  tooltipName: 'Please write something...',
  tooltipStyle: 'tooltip-info',
  status: false,
};

const initialState = {
  questions: {
    question: '',
    validatedQuestion: '',
    questionTyping: true,
    changedOption: 'Anytime',
    changeState: true,
    multipleOption: false,
    addOption: true,
    optionsCount: 3,
    options: [],
  },
  questionReset: {
    ...defaultStatus,
  },
  chatgptStatus: {
    ...defaultStatus,
  },
  optionsValue: Array.from({ length: 3 }, (_, index) => ({
    id: `index-${index}`,
    question: '',
    chatgptQuestion: '',
    selected: false,
    optionStatus: { ...defaultStatus },
    chatgptOptionStatus: { ...defaultStatus },
    isTyping: true,
  })),
};

export const createQuestSlice = createSlice({
  name: 'createQuest',
  initialState,
  reducers: {
    addQuestion: (state, action) => {
      if (action.payload === state.questions.validatedQuestion) {
        state.questionReset = state.chatgptStatus;
        state.questions.question = state.questions.validatedQuestion;
        state.questions.questionTyping = false;
        return;
      }
      state.questions.questionTyping = true;
      state.questions.question = action.payload;
      state.questionReset = { ...defaultStatus };
    },
    updateQuestion: (state, action) => {
      const { question, changedOption, changeState } = action.payload;
      return {
        ...state,
        questions: { ...state.questions, question, changedOption, changeState },
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
      };
    },
    updateRankedChoice: (state, action) => {
      const { question, changedOption, changeState, addOption, optionsCount, options } = action.payload;
      return {
        ...state,
        questions: { ...state.questions, question, changedOption, changeState, addOption, optionsCount, options },
      };
    },
    addOptionById: (state, action) => {
      const { id, option } = action.payload;
      const index = state.optionsValue.findIndex((option) => option.id === id);

      if (index !== -1) {
        state.optionsValue[index].question = option;
        state.optionsValue[index].isTyping = true;
        if (option === state.optionsValue[index].chatgptQuestion) {
          state.optionsValue[index].optionStatus = state.optionsValue[index].chatgptOptionStatus;
          state.optionsValue[index].isTyping = false;
          return;
        }
        state.optionsValue[index].optionStatus = { ...defaultStatus };
      } else {
        console.error(`Option with the provided id ${id} not found.`);
      }
    },
    addNewOption: (state, action) => {
      const newOption = {
        id: `index-${state.optionsValue.length}`,
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
    },
    delOption: (state, action) => {
      const tempOptions = state.optionsValue.filter((value) => value.id !== action.payload.id);

      const updatedTypedValues = tempOptions.map((item, index) => {
        return {
          ...item,
          id: `index-${index}`,
        };
      });

      state.optionsValue = updatedTypedValues;
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
      state.questions.questionTyping = false;
    });
    builder.addCase(checkQuestion.fulfilled, (state, action) => {
      const { validatedQuestion, errorMessage } = action.payload;
      if (errorMessage) {
        if (errorMessage === 'DUPLICATION') {
          state.questions.question = validatedQuestion;
          state.questions.validatedQuestion = validatedQuestion;
          state.questions.questionTyping = false;
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
          state.questions.validatedQuestion = state.questions.question;
          state.questions.questionTyping = false;
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
        state.questions.validatedQuestion = validatedQuestion;
        state.questions.questionTyping = false;
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

    // check answer status start
    builder.addCase(checkAnswer.pending, (state, action) => {
      const { id, value } = action.meta.arg;
      const updatedOptions = state.optionsValue.map((option) =>
        option.id === id
          ? {
              ...option,
              question: value,
              chatgptQuestion: value,
              optionStatus: getCheckingStatus(),
              chatgptOptionStatus: getCheckingStatus(),
              isTyping: false,
            }
          : option,
      );
      state.optionsValue = updatedOptions;
    });
    builder.addCase(checkAnswer.fulfilled, (state, action) => {
      const { id, result, index } = action.payload;
      const validatedAnswer = result.validatedAnswer;

      if (validatedAnswer) {
        const duplicate = checkAnswerExistCreateQuest({
          answersArray: JSON.parse(JSON.stringify(state.optionsValue)),
          answer: validatedAnswer,
          index,
        });

        const optionStatus = duplicate ? getDuplicateStatus() : getVerifiedStatus();

        const updatedOptions = state.optionsValue.map((option) =>
          option.id === id
            ? {
                ...option,
                question: validatedAnswer,
                chatgptQuestion: validatedAnswer,
                optionStatus,
                chatgptOptionStatus: optionStatus,
                isTyping: false,
                duplication: duplicate,
              }
            : option,
        );
        state.optionsValue = updatedOptions;
      } else {
        const updatedOptions = state.optionsValue.map((option) =>
          option.id === id
            ? {
                ...option,
                optionStatus: getRejectedStatus(),
                chatgptOptionStatus: getRejectedStatus(),
                isTyping: false,
              }
            : option,
        );
        state.optionsValue = updatedOptions;
      }
    });
  },
});

const getCheckingStatus = () => ({
  name: 'Checking',
  color: 'text-[#0FB063]',
  tooltipName: 'Verifying your answer. Please wait...',
  tooltipStyle: 'tooltip-success',
});

const getVerifiedStatus = () => ({
  name: 'Ok',
  color: 'text-[#0FB063]',
  tooltipName: 'Answer is Verified',
  tooltipStyle: 'tooltip-success',
});

const getDuplicateStatus = () => ({
  name: 'Duplicate',
  color: 'text-[#EFD700]',
  tooltipName: 'Found Duplication!',
  tooltipStyle: 'tooltip-error',
  duplication: true,
});

const getRejectedStatus = () => ({
  name: 'Rejected',
  color: 'text-[#b00f0f]',
  tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
  tooltipStyle: 'tooltip-error',
});

export const {
  addQuestion,
  updateQuestion,
  updateMultipleChoice,
  updateRankedChoice,
  addOptionById,
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
