import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SeldonState {
  system: string;
  question: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

const initialState: SeldonState = {
  system:
    'Only use Foundation post data. Find correlations. Make ground breaking conclusions and discoveries. Never mention vote/respondent counts. Always respond with a title, abstract and up to 5 findings only. at the end, give additional new poll suggestions with options in one parentheses.',
  question: '',
  temperature: 0,
  max_tokens: 1024,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export const seldonSlice = createSlice({
  name: 'seldon',
  initialState,
  reducers: {
    handleSeldonInput: (state, action: PayloadAction<{ name: keyof SeldonState; value: string | number }>) => {
      const { name, value } = action.payload;
      (state[name] as string | number) = value;
    },
    resetSeldonState: () => initialState,
  },
});

export const { handleSeldonInput, resetSeldonState } = seldonSlice.actions;

export default seldonSlice.reducer;

export const getSeldonState = (state: any) => state.seldon;
