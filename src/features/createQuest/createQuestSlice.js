import * as questServices from '../../services/api/questsApi';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkAnswerExistCreateQuest } from '../../services/api/questsApi';

export const checkDescription = createAsyncThunk('createQuest/checkDescription', async (value) => {
  const result = await questServices.questionValidation({
    question: value,
    queryType: 'yes/no',
  });
  return result;
});

export const checkAudioDescription = createAsyncThunk('createQuest/checkAudioDescription', async (value) => {
  const result = await questServices.questionValidation({
    question: value,
    queryType: 'yes/no',
  });
  return result;
});

export const checkPicsDescription = createAsyncThunk('createQuest/checkPicsDescription', async (value) => {
  const result = await questServices.questionValidation({
    question: value,
    queryType: 'yes/no',
  });
  return result;
});

export const checkIsUrlAlreayExists = createAsyncThunk('createQuest/checkIsUrlAlreayExists', async (data) => {
  const result = await questServices.urlDuplicateCheck(data);
  return result;
});

export const checkAudioUrl = createAsyncThunk('createQuest/checkAudioUrl', async (data) => {
  const result = await questServices.urlDuplicateCheck(data);
  return result;
});

export const checkPictureUrl = createAsyncThunk('createQuest/checkPictureUrl', async (data) => {
  const result = await questServices.pictureUrlCheck(data);
  console.log({ result });
  return result;
});

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
  showToolTipMsg: true,
};

const initialState = {
  media: {
    isMedia: {
      isMedia: false,
      type: '',
    },
    desctiption: '',
    validatedDescription: '',
    mediaDescStatus: {
      ...defaultStatus,
    },
    chatgptMediaDescStatus: {
      ...defaultStatus,
    },
    url: '',
    validatedUrl: '',
    urlStatus: {
      ...defaultStatus,
    },
    chatgptUrlStatus: {
      ...defaultStatus,
    },
  },
  audio: {
    isAudio: false,
    audioDesc: '',
    validatedAudioDesc: '',
    audioDescStatus: {
      ...defaultStatus,
    },
    chatgptAudioDescStatus: {
      ...defaultStatus,
    },
    audioUrl: '',
    validatedAudioUrl: '',
    audioUrlStatus: {
      ...defaultStatus,
    },
    chatgptAudioUrlStatus: {
      ...defaultStatus,
    },
  },
  pictureMedia: {
    isPicMedia: false,
    picDesctiption: '',
    validatedPicDescription: '',
    picDescStatus: {
      ...defaultStatus,
    },
    chatgptPicDescStatus: {
      ...defaultStatus,
    },
    picUrl: '',
    validatedPicUrl: '',
    picUrlStatus: {
      ...defaultStatus,
    },
    chatgptPicUrlStatus: {
      ...defaultStatus,
    },
  },
  questions: {
    question: '',
    validatedQuestion: '',
    questionTyping: true,
    changedOption: 'Anytime',
    changeState: true,
    multipleOption: false,
    addOption: true,
    optionsCount: 2,
    options: [],
  },
  questionReset: {
    ...defaultStatus,
  },
  chatgptStatus: {
    ...defaultStatus,
  },
  optionsValue: Array.from({ length: 2 }, (_, index) => ({
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
    updateIsMedia: (state, action) => {
      const { isMedia, type } = action.payload;
      state.media.isMedia.isMedia = isMedia;
      state.media.isMedia.type = type;
    },
    updateIsAudio: (state, action) => {
      state.audio.isAudio = action.payload;
    },
    updateIsPicMedia: (state, action) => {
      state.pictureMedia.isPicMedia = action.payload;
    },
    // Description
    addMediaDesc: (state, action) => {
      // state.media.desctiption = action.payload;
      if (action.payload === state.media.validatedDescription) {
        state.media.mediaDescStatus = state.media.chatgptMediaDescStatus;
        state.media.desctiption = state.media.validatedDescription;
        // state.questions.questionTyping = false;
        return;
      }
      state.media.mediaDescStatus = { ...defaultStatus };
      state.media.desctiption = action.payload;
      // state.questions.questionTyping = true;
    },
    addAudioDesc: (state, action) => {
      if (action.payload === state.audio.validatedDescription) {
        state.audio.audioDescStatus = state.audio.chatgptAudioDescStatus;
        state.audio.audioDesc = state.audio.validatedAudioDesc;
        return;
      }
      state.audio.audioDescStatus = { ...defaultStatus };
      state.audio.audioDesc = action.payload;
    },
    addPicsMediaDesc: (state, action) => {
      if (action.payload === state.media.validatedDescription) {
        state.pictureMedia.picDescStatus = state.pictureMedia.chatgptPicDescStatus;
        state.pictureMedia.picDesctiption = state.pictureMedia.validatedPicDescription;
        return;
      }
      state.pictureMedia.picDescStatus = { ...defaultStatus };
      state.pictureMedia.picDesctiption = action.payload;
    },
    // Url
    addMediaUrl: (state, action) => {
      if (action.payload === state.media.validatedUrl) {
        state.media.urlStatus = state.media.chatgptUrlStatus;
        state.media.url = state.media.validatedUrl;
        return;
      }
      state.media.urlStatus = { ...defaultStatus };
      state.media.url = action.payload;
      // state.media.urlStatus = { ...defaultStatus };
    },
    addAudioUrl: (state, action) => {
      if (action.payload === state.audio.validatedAudioUrl) {
        state.audio.audioUrlStatus = state.audio.chatgptAudioUrlStatus;
        state.audio.audioUrl = state.audio.validatedAudioUrl;
        return;
      }
      state.audio.audioUrlStatus = { ...defaultStatus };
      state.audio.audioUrl = action.payload;
    },
    addPicUrl: (state, action) => {
      if (action.payload === state.pictureMedia.validatedPicUrl) {
        state.pictureMedia.picUrlStatus = state.pictureMedia.chatgptPicUrlStatus;
        state.pictureMedia.picUrl = state.pictureMedia.validatedPicUrl;
        return;
      }
      state.pictureMedia.picUrlStatus = { ...defaultStatus };
      state.pictureMedia.picUrl = action.payload;
    },
    // Questions
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
    // Options
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

      if (option === '') {
        state.optionsValue[index].question = option;
        state.optionsValue[index].isTyping = true;
        state.optionsValue[index].optionStatus = { ...defaultStatus };
        return;
      }

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
    hideToolTipMessage: (state, action) => {
      const { id, type } = action.payload;

      if (!type) {
        if (id) {
          const parts = id.split('-');
          const index = parseInt(parts[1]);

          state.optionsValue[index - 3].optionStatus.showToolTipMsg = false;
        } else {
          state.questionReset.showToolTipMsg = false;
        }
      } else if (type === 'media') {
        state.media.mediaDescStatus.showToolTipMsg = false;
      } else if (type === 'mediaURL') {
        state.media.urlStatus.showToolTipMsg = false;
      }
    },
    clearUrl: (state, action) => {
      state.media.url = '';
      state.media.validatedUrl = '';
      state.media.urlStatus = { ...defaultStatus };
      state.media.chatgptUrlStatus = { ...defaultStatus };
    },
    clearMedia: (state = initialState, action) => {
      return {
        ...state,
        media: initialState.media,
      };
    },
    clearPicsUrl: (state, action) => {
      state.pictureMedia.picUrl = '';
      state.pictureMedia.validatedPicUrl = '';
      state.pictureMedia.picUrlStatus = { ...defaultStatus };
      state.pictureMedia.chatgptPicUrlStatus = { ...defaultStatus };
    },
    clearPicsMedia: (state = initialState, action) => {
      return {
        ...state,
        pictureMedia: initialState.pictureMedia,
      };
    },
  },
  extraReducers: (builder) => {
    // check description status start
    builder.addCase(checkDescription.pending, (state, action) => {
      state.media.mediaDescStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
      state.media.chatgptMediaDescStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
      // state.questions.questionTyping = false;
    });
    builder.addCase(checkDescription.fulfilled, (state, action) => {
      const { validatedQuestion, errorMessage } = action.payload;
      if (errorMessage) {
        if (errorMessage === 'DUPLICATION') {
          state.media.desctiption = validatedQuestion;
          state.media.validatedDescription = validatedQuestion;
          // state.questions.questionTyping = false;
          state.media.mediaDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          state.media.chatgptMediaDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          // state.media.mediaDescStatus = {
          //   name: 'Duplicate',
          //   color: 'text-[#EFD700]',
          //   tooltipName: 'This post is not unique. A post like this already exists.',
          //   tooltipStyle: 'tooltip-error',
          //   duplication: true,
          //   showToolTipMsg: true,
          // };
          // state.media.chatgptMediaDescStatus = {
          //   name: 'Duplicate',
          //   color: 'text-[#EFD700]',
          //   tooltipName: 'This post is not unique. A post like this already exists.',
          //   tooltipStyle: 'tooltip-error',
          //   duplication: true,
          //   showToolTipMsg: true,
          // };
        } else {
          state.media.validatedDescription = state.questions.question;
          // state.questions.questionTyping = false;
          state.media.mediaDescStatus = {
            name: 'Rejected',
            color: 'text-[#b00f0f]',
            tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
            tooltipStyle: 'tooltip-error',
            status: true,
            showToolTipMsg: true,
          };
          state.media.chatgptMediaDescStatus = {
            name: 'Rejected',
            color: 'text-[#b00f0f]',
            tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
            tooltipStyle: 'tooltip-error',
            status: true,
            showToolTipMsg: true,
          };
        }
      } else {
        if (validatedQuestion === state.questions.validatedQuestion) {
          state.media.desctiption = validatedQuestion;
          state.media.validatedDescription = validatedQuestion;
          // state.questions.questionTyping = false;
          // state.media.mediaDescStatus = {
          //   name: 'Duplicate',
          //   color: 'text-[#EFD700]',
          //   tooltipName: 'This post is not unique. A post like this already exists.',
          //   tooltipStyle: 'tooltip-error',
          //   duplication: true,
          //   showToolTipMsg: true,
          // };
          // state.media.chatgptMediaDescStatus = {
          //   name: 'Duplicate',
          //   color: 'text-[#EFD700]',
          //   tooltipName: 'This post is not unique. A post like this already exists.',
          //   tooltipStyle: 'tooltip-error',
          //   duplication: true,
          //   showToolTipMsg: true,
          // };
          state.media.mediaDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          state.media.chatgptMediaDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
        } else {
          state.media.desctiption = validatedQuestion;
          state.media.validatedDescription = validatedQuestion;
          // state.questions.questionTyping = false;
          state.media.mediaDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          state.media.chatgptMediaDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
        }
      }
    });

    // check Audio Description status
    builder.addCase(checkAudioDescription.pending, (state, action) => {
      state.audio.audioDescStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
      state.audio.chatgptAudioDescStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
    });
    builder.addCase(checkAudioDescription.fulfilled, (state, action) => {
      const { validatedQuestion, errorMessage } = action.payload;
      if (errorMessage) {
        if (errorMessage === 'DUPLICATION') {
          state.audio.audioDesc = validatedQuestion;
          state.audio.validatedAudioDesc = validatedQuestion;
          // state.questions.questionTyping = false;
          // state.audio.audioDescStatus = {
          //   name: 'Duplicate',
          //   color: 'text-[#EFD700]',
          //   tooltipName: 'This post is not unique. A post like this already exists.',
          //   tooltipStyle: 'tooltip-error',
          //   duplication: true,
          //   showToolTipMsg: true,
          // };
          // state.audio.chatgptAudioDescStatus = {
          //   name: 'Duplicate',
          //   color: 'text-[#EFD700]',
          //   tooltipName: 'This post is not unique. A post like this already exists.',
          //   tooltipStyle: 'tooltip-error',
          //   duplication: true,
          //   showToolTipMsg: true,
          // };
          state.media.mediaDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          state.media.chatgptMediaDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
        } else {
          state.audio.validatedAudioDesc = state.questions.question;
          // state.questions.questionTyping = false;
          state.audio.audioDescStatus = {
            name: 'Rejected',
            color: 'text-[#b00f0f]',
            tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
            tooltipStyle: 'tooltip-error',
            status: true,
            showToolTipMsg: true,
          };
          state.audio.chatgptAudioDescStatus = {
            name: 'Rejected',
            color: 'text-[#b00f0f]',
            tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
            tooltipStyle: 'tooltip-error',
            status: true,
            showToolTipMsg: true,
          };
        }
      } else {
        if (validatedQuestion === state.questions.validatedQuestion) {
          state.audio.audioDesc = validatedQuestion;
          state.audio.validatedAudioDesc = validatedQuestion;
          // state.questions.questionTyping = false;
          state.audio.audioDescStatus = {
            name: 'Duplicate',
            color: 'text-[#EFD700]',
            tooltipName: 'This post is not unique. A post like this already exists.',
            tooltipStyle: 'tooltip-error',
            duplication: true,
            showToolTipMsg: true,
          };
          state.audio.chatgptAudioDescStatus = {
            name: 'Duplicate',
            color: 'text-[#EFD700]',
            tooltipName: 'This post is not unique. A post like this already exists.',
            tooltipStyle: 'tooltip-error',
            duplication: true,
            showToolTipMsg: true,
          };
        } else {
          state.audio.audioDesc = validatedQuestion;
          state.audio.validatedAudioDesc = validatedQuestion;
          // state.questions.questionTyping = false;
          state.audio.audioDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          state.audio.chatgptAudioDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
        }
      }
    });

    // check description status start
    builder.addCase(checkPicsDescription.pending, (state, action) => {
      state.pictureMedia.picDescStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
      state.pictureMedia.chatgptPicDescStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
      // state.questions.questionTyping = false;
    });
    builder.addCase(checkPicsDescription.fulfilled, (state, action) => {
      const { validatedQuestion, errorMessage } = action.payload;
      if (errorMessage) {
        if (errorMessage === 'DUPLICATION') {
          state.pictureMedia.picDesctiption = validatedQuestion;
          state.pictureMedia.validatedPicDescription = validatedQuestion;
          // state.questions.questionTyping = false;
          state.pictureMedia.picDescStatus = {
            name: 'Duplicate',
            color: 'text-[#EFD700]',
            tooltipName: 'This post is not unique. A post like this already exists.',
            tooltipStyle: 'tooltip-error',
            duplication: true,
            showToolTipMsg: true,
          };
          state.pictureMedia.chatgptPicDescStatus = {
            name: 'Duplicate',
            color: 'text-[#EFD700]',
            tooltipName: 'This post is not unique. A post like this already exists.',
            tooltipStyle: 'tooltip-error',
            duplication: true,
            showToolTipMsg: true,
          };
        } else {
          state.pictureMedia.validatedPicDescription = state.questions.question;
          // state.questions.questionTyping = false;
          state.pictureMedia.picDescStatus = {
            name: 'Rejected',
            color: 'text-[#b00f0f]',
            tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
            tooltipStyle: 'tooltip-error',
            status: true,
            showToolTipMsg: true,
          };
          state.pictureMedia.chatgptPicDescStatus = {
            name: 'Rejected',
            color: 'text-[#b00f0f]',
            tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
            tooltipStyle: 'tooltip-error',
            status: true,
            showToolTipMsg: true,
          };
        }
      } else {
        if (validatedQuestion === state.questions.validatedQuestion) {
          state.pictureMedia.picDesctiption = validatedQuestion;
          state.pictureMedia.validatedPicDescription = validatedQuestion;
          // state.questions.questionTyping = false;
          state.pictureMedia.picDescStatus = {
            name: 'Duplicate',
            color: 'text-[#EFD700]',
            tooltipName: 'This post is not unique. A post like this already exists.',
            tooltipStyle: 'tooltip-error',
            duplication: true,
            showToolTipMsg: true,
          };
          state.pictureMedia.chatgptPicDescStatus = {
            name: 'Duplicate',
            color: 'text-[#EFD700]',
            tooltipName: 'This post is not unique. A post like this already exists.',
            tooltipStyle: 'tooltip-error',
            duplication: true,
            showToolTipMsg: true,
          };
        } else {
          state.pictureMedia.picDesctiption = validatedQuestion;
          state.pictureMedia.validatedPicDescription = validatedQuestion;
          // state.questions.questionTyping = false;
          state.pictureMedia.picDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          state.pictureMedia.chatgptPicDescStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
        }
      }
    });

    // check url status start
    builder.addCase(checkIsUrlAlreayExists.pending, (state, action) => {
      state.media.urlStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
      state.media.chatgptUrlStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
      // state.questions.questionTyping = false;
    });
    builder.addCase(checkIsUrlAlreayExists.fulfilled, (state, action) => {
      const { message, errorMessage, url } = action.payload;
      if (state.media.url === '') {
        state.media.urlStatus = { ...defaultStatus };
        state.media.chatgptUrlStatus = { ...defaultStatus };
      } else {
        if (errorMessage) {
          if (errorMessage === 'DUPLICATION') {
            state.media.validatedUrl = state.media.url;
            // state.media.desctiption = message;
            // state.media.validatedDescription = message;
            // state.questions.questionTyping = false;
            state.media.urlStatus = {
              name: 'Duplicate',
              color: 'text-[#EFD700]',
              tooltipName: 'This url is not unique. A url like this already exists.',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
            state.media.chatgptUrlStatus = {
              name: 'Duplicate',
              color: 'text-[#EFD700]',
              tooltipName: 'This url is not unique. A url like this already exists.',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
          }
          if (errorMessage === 'ADULT') {
            state.media.validatedUrl = state.media.url;
            // state.media.desctiption = message;
            // state.media.validatedDescription = message;
            // state.questions.questionTyping = false;
            state.media.urlStatus = {
              name: 'Rejected',
              color: 'text-[#b00f0f]',
              tooltipName: 'It is an adult video',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
            state.media.chatgptUrlStatus = {
              name: 'Rejected',
              color: 'text-[#b00f0f]',
              tooltipName: 'It is an adult video',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
          }
          // else {
          //   state.media.validatedDescription = state.questions.question;
          //   // state.questions.questionTyping = false;
          //   state.media.mediaDescStatus = {
          //     name: 'Rejected',
          //     color: 'text-[#b00f0f]',
          //     tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
          //     tooltipStyle: 'tooltip-error',
          //     status: true,
          //     showToolTipMsg: true,
          //   };
          //   state.media.chatgptMediaDescStatus = {
          //     name: 'Rejected',
          //     color: 'text-[#b00f0f]',
          //     tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
          //     tooltipStyle: 'tooltip-error',
          //     status: true,
          //     showToolTipMsg: true,
          //   };
          // }
        } else {
          // if (message === state.questions.message) {
          //   state.media.desctiption = message;
          //   state.media.validatedDescription = message;
          //   // state.questions.questionTyping = false;
          //   state.media.mediaDescStatus = {
          //     name: 'Duplicate',
          //     color: 'text-[#EFD700]',
          //     tooltipName: 'This post is not unique. A post like this already exists.',
          //     tooltipStyle: 'tooltip-error',
          //     duplication: true,
          //     showToolTipMsg: true,
          //   };
          //   state.media.chatgptMediaDescStatus = {
          //     name: 'Duplicate',
          //     color: 'text-[#EFD700]',
          //     tooltipName: 'This post is not unique. A post like this already exists.',
          //     tooltipStyle: 'tooltip-error',
          //     duplication: true,
          //     showToolTipMsg: true,
          //   };
          // }
          // else
          // {
          // state.media.desctiption = message;
          // state.media.validatedDescription = message;
          // state.questions.questionTyping = false;
          state.media.url = url;
          state.media.validatedUrl = url;
          state.media.urlStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          state.media.chatgptUrlStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          // }
        }
      }
    });

    // check audio url status start
    builder.addCase(checkAudioUrl.pending, (state, action) => {
      state.audio.audioUrlStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
      state.audio.chatgptAudioUrlStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
      // state.questions.questionTyping = false;
    });
    builder.addCase(checkAudioUrl.fulfilled, (state, action) => {
      const { message, errorMessage, url } = action.payload;
      if (state.audio.audioUrl === '') {
        state.audio.audioUrlStatus = { ...defaultStatus };
        state.audio.chatgptAudioUrlStatus = { ...defaultStatus };
      } else {
        if (errorMessage) {
          if (errorMessage === 'DUPLICATION') {
            state.audio.validatedAudioUrl = state.audio.url;
            // state.media.desctiption = message;
            // state.media.validatedDescription = message;
            // state.questions.questionTyping = false;
            state.audio.audioUrlStatus = {
              name: 'Duplicate',
              color: 'text-[#EFD700]',
              tooltipName: 'This url is not unique. A url like this already exists.',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
            state.audio.chatgptAudioUrlStatus = {
              name: 'Duplicate',
              color: 'text-[#EFD700]',
              tooltipName: 'This url is not unique. A url like this already exists.',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
          }
          if (errorMessage === 'ADULT') {
            state.audio.validatedAudioUrl = state.audio.audioUrl;
            // state.media.desctiption = message;
            // state.media.validatedDescription = message;
            // state.questions.questionTyping = false;
            state.audio.audioUrlStatus = {
              name: 'Rejected',
              color: 'text-[#b00f0f]',
              tooltipName: 'It is an adult video',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
            state.audio.chatgptAudioUrlStatus = {
              name: 'Rejected',
              color: 'text-[#b00f0f]',
              tooltipName: 'It is an adult video',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
          }
          // else {
          //   state.media.validatedDescription = state.questions.question;
          //   // state.questions.questionTyping = false;
          //   state.media.mediaDescStatus = {
          //     name: 'Rejected',
          //     color: 'text-[#b00f0f]',
          //     tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
          //     tooltipStyle: 'tooltip-error',
          //     status: true,
          //     showToolTipMsg: true,
          //   };
          //   state.media.chatgptMediaDescStatus = {
          //     name: 'Rejected',
          //     color: 'text-[#b00f0f]',
          //     tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
          //     tooltipStyle: 'tooltip-error',
          //     status: true,
          //     showToolTipMsg: true,
          //   };
          // }
        } else {
          // if (message === state.questions.message) {
          //   state.media.desctiption = message;
          //   state.media.validatedDescription = message;
          //   // state.questions.questionTyping = false;
          //   state.media.mediaDescStatus = {
          //     name: 'Duplicate',
          //     color: 'text-[#EFD700]',
          //     tooltipName: 'This post is not unique. A post like this already exists.',
          //     tooltipStyle: 'tooltip-error',
          //     duplication: true,
          //     showToolTipMsg: true,
          //   };
          //   state.media.chatgptMediaDescStatus = {
          //     name: 'Duplicate',
          //     color: 'text-[#EFD700]',
          //     tooltipName: 'This post is not unique. A post like this already exists.',
          //     tooltipStyle: 'tooltip-error',
          //     duplication: true,
          //     showToolTipMsg: true,
          //   };
          // }
          // else
          // {
          // state.media.desctiption = message;
          // state.media.validatedDescription = message;
          // state.questions.questionTyping = false;
          state.audio.audioUrl = url;
          state.audio.validatedAudioUrl = url;
          state.audio.audioUrlStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          state.audio.chatgptAudioUrlStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          // }
        }
      }
    });

    // check picture url status
    builder.addCase(checkPictureUrl.pending, (state, action) => {
      state.pictureMedia.picUrlStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
      state.pictureMedia.chatgptPicUrlStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
    });
    builder.addCase(checkPictureUrl.fulfilled, (state, action) => {
      const { message, errorMessage, url } = action.payload;
      if (state.pictureMedia.picUrl === '') {
        state.pictureMedia.picUrlStatus = { ...defaultStatus };
        state.pictureMedia.chatgptPicUrlStatus = { ...defaultStatus };
      } else {
        if (errorMessage) {
          if (errorMessage === 'DUPLICATION') {
            state.pictureMedia.validatedPicUrl = state.pictureMedia.picUrl;
            // state.media.desctiption = message;
            // state.media.validatedDescription = message;
            // state.questions.questionTyping = false;
            state.pictureMedia.picUrlStatus = {
              name: 'Duplicate',
              color: 'text-[#EFD700]',
              tooltipName: 'This url is not unique. A url like this already exists.',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
            state.pictureMedia.chatgptPicUrlStatus = {
              name: 'Duplicate',
              color: 'text-[#EFD700]',
              tooltipName: 'This url is not unique. A url like this already exists.',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
          }
          // if (errorMessage === 'ADULT') {
          //   state.pictureMedia.validatedPicUrl = state.pictureMedia.picUrl;
          //   // state.media.desctiption = message;
          //   // state.media.validatedDescription = message;
          //   // state.questions.questionTyping = false;
          //   state.pictureMedia.picUrlStatus = {
          //     name: 'Rejected',
          //     color: 'text-[#b00f0f]',
          //     tooltipName: 'It is an adult video',
          //     tooltipStyle: 'tooltip-error',
          //     duplication: true,
          //     showToolTipMsg: true,
          //   };
          //   state.pictureMedia.chatgptPicUrlStatus = {
          //     name: 'Rejected',
          //     color: 'text-[#b00f0f]',
          //     tooltipName: 'It is an adult video',
          //     tooltipStyle: 'tooltip-error',
          //     duplication: true,
          //     showToolTipMsg: true,
          //   };
          // }
          else {
            state.pictureMedia.validatedPicUrl = '';
            // state.questions.questionTyping = false;
            state.pictureMedia.picUrlStatus = {
              name: 'Rejected',
              color: 'text-[#b00f0f]',
              tooltipName: 'Invalid Url.',
              tooltipStyle: 'tooltip-error',
              status: true,
              showToolTipMsg: true,
            };
            state.pictureMedia.chatgptPicUrlStatus = {
              name: 'Rejected',
              color: 'text-[#b00f0f]',
              tooltipName: 'Invalid Url.',
              tooltipStyle: 'tooltip-error',
              status: true,
              showToolTipMsg: true,
            };
          }
        } else {
          // if (message === state.questions.message) {
          //   state.media.desctiption = message;
          //   state.media.validatedDescription = message;
          //   // state.questions.questionTyping = false;
          //   state.media.mediaDescStatus = {
          //     name: 'Duplicate',
          //     color: 'text-[#EFD700]',
          //     tooltipName: 'This post is not unique. A post like this already exists.',
          //     tooltipStyle: 'tooltip-error',
          //     duplication: true,
          //     showToolTipMsg: true,
          //   };
          //   state.media.chatgptMediaDescStatus = {
          //     name: 'Duplicate',
          //     color: 'text-[#EFD700]',
          //     tooltipName: 'This post is not unique. A post like this already exists.',
          //     tooltipStyle: 'tooltip-error',
          //     duplication: true,
          //     showToolTipMsg: true,
          //   };
          // }
          // else
          // {
          // state.media.desctiption = message;
          // state.media.validatedDescription = message;
          // state.questions.questionTyping = false;
          state.pictureMedia.picUrl = url;
          state.pictureMedia.validatedPicUrl = url;
          state.pictureMedia.picUrlStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          state.pictureMedia.chatgptPicUrlStatus = {
            name: 'Ok',
            color: 'text-[#0FB063]',
            tooltipName: 'Question is Verified',
            tooltipStyle: 'tooltip-success',
            isVerifiedQuestion: true,
            status: false,
          };
          // }
        }
      }
    });

    // check question status start
    builder.addCase(checkQuestion.pending, (state, action) => {
      state.questionReset = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
      };
      state.chatgptStatus = {
        name: 'Checking',
        color: 'text-[#0FB063]',
        tooltipName: 'Verifying your question. Please wait...',
        tooltipStyle: 'tooltip-success',
        status: false,
        showToolTipMsg: true,
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
          if (state.media.isMedia.isMedia === true || state.pictureMedia.isPicMedia === true) {
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
          } else {
            state.questionReset = {
              name: 'Duplicate',
              color: 'text-[#EFD700]',
              tooltipName: 'This post is not unique. A post like this already exists.',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
            state.chatgptStatus = {
              name: 'Duplicate',
              color: 'text-[#EFD700]',
              tooltipName: 'This post is not unique. A post like this already exists.',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
          }
        } else {
          state.questions.validatedQuestion = state.questions.question;
          state.questions.questionTyping = false;
          state.questionReset = {
            name: 'Rejected',
            color: 'text-[#b00f0f]',
            tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
            tooltipStyle: 'tooltip-error',
            status: true,
            showToolTipMsg: true,
          };
          state.chatgptStatus = {
            name: 'Rejected',
            color: 'text-[#b00f0f]',
            tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
            tooltipStyle: 'tooltip-error',
            status: true,
            showToolTipMsg: true,
          };
        }
      } else {
        if (validatedQuestion === state.media.validatedDescription) {
          state.questions.question = validatedQuestion;
          state.questions.validatedQuestion = validatedQuestion;
          state.questions.questionTyping = false;
          if (state.media.isMedia.isMedia === true || state.pictureMedia.isPicMedia === true) {
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
          } else {
            state.questionReset = {
              name: 'Duplicate',
              color: 'text-[#EFD700]',
              tooltipName: 'This post is not unique. A post like this already exists.',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
            };
            state.chatgptStatus = {
              name: 'Duplicate',
              color: 'text-[#EFD700]',
              tooltipName: 'This post is not unique. A post like this already exists.',
              tooltipStyle: 'tooltip-error',
              duplication: true,
              showToolTipMsg: true,
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
  showToolTipMsg: true,
});

const getRejectedStatus = () => ({
  name: 'Rejected',
  color: 'text-[#b00f0f]',
  tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
  tooltipStyle: 'tooltip-error',
  showToolTipMsg: true,
});

export const {
  updateIsMedia,
  updateIsAudio,
  updateIsPicMedia,
  addMediaDesc,
  addAudioDesc,
  addPicsMediaDesc,
  addMediaUrl,
  addAudioUrl,
  addPicUrl,
  addQuestion,
  updateQuestion,
  updateMultipleChoice,
  updateRankedChoice,
  addOptionById,
  resetCreateQuest,
  hideToolTipMessage,
  handleQuestionReset,
  addNewOption,
  delOption,
  drapAddDrop,
  handleChangeOption,
  clearUrl,
  clearMedia,
  clearPicsUrl,
  clearPicsMedia,
} = createQuestSlice.actions;

export default createQuestSlice.reducer;

export const getMedia = (state) => state.createQuest.media;
export const getAudio = (state) => state.createQuest.audio;
export const getPicsMedia = (state) => state.createQuest.pictureMedia;
export const getCreate = (state) => state.createQuest.questions;
export const questionStatus = (state) => state.createQuest.questionReset;
export const questionChatgptStatus = (state) => state.createQuest.chatgptStatus;
export const optionsValue = (state) => state.createQuest.optionsValue;
