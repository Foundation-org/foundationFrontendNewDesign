import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SeldonDataState {
  prompt: string;
  articleId: string;
  title: string;
  abstract: string;
  seoSummary: string;
  findings: {
    heading: string;
    content: string;
  }[];
  sources: string[];
  suggestions: {
    _id: string;
    statement: string;
    options: string[];
  }[];
  debug: string;
  createdAt: string;
}

const initialState: SeldonDataState = {
  prompt: '',
  articleId: '',
  title: '',
  abstract: '',
  seoSummary: '',
  findings: [],
  suggestions: [],
  sources: [],
  debug: '',
  createdAt: '',
};

export const SeldonDataSlice = createSlice({
  name: 'seldonData',
  initialState,
  reducers: {
    setSeldonData: (state, action: PayloadAction<Partial<SeldonDataState>>) => {
      return { ...state, ...action.payload };
    },
    addDebug: (state, action: PayloadAction<{ debug: string; sources: string[] }>) => {
      state.debug = action.payload.debug;
      state.sources = action.payload.sources;
      state.prompt = '';
      state.articleId = '';
      state.title = '';
      state.abstract = '';
      state.seoSummary = '';
      state.findings = [];
      state.suggestions = [];
      state.createdAt = '';
    },
    addSourceAtStart: (state, action: PayloadAction<string>) => {
      state.sources.unshift(action.payload);
    },
    removeSource: (state, action: PayloadAction<string>) => {
      if (state.sources.length > 1) {
        state.sources = state.sources.filter((source) => source !== action.payload);
      }
    },
  },
});

export const { setSeldonData, addDebug, addSourceAtStart, removeSource } = SeldonDataSlice.actions;

export default SeldonDataSlice.reducer;

export const getSeldonDataStates = (state: any) => state.seldonData;
