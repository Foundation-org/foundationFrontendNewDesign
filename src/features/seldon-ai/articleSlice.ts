import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ArticleState {
  prompt: string;
  articleId: string;
  title: string;
  abstract: string;
  findings: {
    heading: string;
    content: string;
  };
  sources: string[];
  suggestion: {
    _id: string;
    statement: string;
    options: string[];
  }[];
}

const initialState: ArticleState = {
  prompt: '',
  articleId: '',
  title: '',
  abstract: '',
  findings: {
    heading: '',
    content: '',
  },
  suggestion: [],
  sources: [],
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setArticleData: (state, action: PayloadAction<Partial<ArticleState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setArticleData } = articleSlice.actions;

export default articleSlice.reducer;

export const getArticleStates = (state: any) => state.article;
