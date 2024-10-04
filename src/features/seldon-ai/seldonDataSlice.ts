import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SeldonDataState {
  prompt: string;
  articleId: string;
  title: string;
  abstract: string;
  seoSummary: string;
  groundBreakingFindings: {
    heading: string;
    content: string;
  }[];
  discussion: String;
  conclusion: String;
  source: string[];
  suggestions: {
    _id: string;
    statement: string;
    options: string[];
  }[];
  debug: string;
  createdAt: string;
  updatedAt: string;
}

const initialState: SeldonDataState = {
  prompt: '',
  articleId: '',
  title: '',
  abstract: '',
  seoSummary: '',
  groundBreakingFindings: [],
  discussion: '',
  conclusion: '',
  suggestions: [],
  source: [],
  debug: '',
  createdAt: '',
  updatedAt: '',
};

export const SeldonDataSlice = createSlice({
  name: 'seldonData',
  initialState,
  reducers: {
    setSeldonData: (state, action: PayloadAction<Partial<SeldonDataState>>) => {
      return { ...state, ...action.payload };
    },
    addDebug: (state, action: PayloadAction<{ debug: string; source: string[] }>) => {
      state.debug = action.payload.debug;
      state.source = action.payload.source;
      state.prompt = '';
      state.articleId = '';
      state.title = '';
      state.abstract = '';
      state.seoSummary = '';
      state.discussion = '';
      state.conclusion = '';
      state.groundBreakingFindings = [];
      state.suggestions = [];
      state.createdAt = '';
      state.updatedAt = '';
    },
    addSourceAtStart: (state, action: PayloadAction<string>) => {
      state.source.unshift(action.payload);
    },
    removeSource: (state, action: PayloadAction<string>) => {
      state.source = state.source.filter((source) => source !== action.payload);
    },
  },
});

export const { setSeldonData, addDebug, addSourceAtStart, removeSource } = SeldonDataSlice.actions;

export default SeldonDataSlice.reducer;

export const getSeldonDataStates = (state: any) => state.seldonData;
