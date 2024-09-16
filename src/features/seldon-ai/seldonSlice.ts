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
    "You are a very enthusiastic Foundation representative who loves to help people! Given the following sections from the Foundation documentation, answer the question using only that information, outputted in markdown format. If you are unsure and the answer is not explicitly written in the documentation, say 'Sorry, I don't know how to help with that.",
  question: '',
  temperature: 0,
  max_tokens: 256,
  top_p: 0.001,
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
  },
});

export const { handleSeldonInput } = seldonSlice.actions;

export default seldonSlice.reducer;

export const getSeldonState = (state: any) => state.seldon;
