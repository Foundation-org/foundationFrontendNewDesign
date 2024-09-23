import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SeldonState {
  system: string;
  question: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  fetchK: number;
  lambda: number;
  knowledgebase: string[];
}

const initialState: SeldonState = {
  system:
    'Only use Foundation post data. Find strong correlations. Make ground breaking conclusions and discoveries. NEVER cite vote counts, respondents, selections, or individuals. Always respond with a title, abstract and as many new findings as you can. At the end, give as many new poll and survey suggestions, only multiple choice, open-ended and yes/no, with options separated by slashes in one parentheses that you can that do not already exist in current posts.',
  question: '',
  temperature: 0,
  max_tokens: 1024,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  fetchK: 5,
  lambda: 0.5,
  knowledgebase: ['user', 'about', 'knowladgebaseone'],
};

export const seldonSlice = createSlice({
  name: 'seldon',
  initialState,
  reducers: {
    handleSeldonInput: (state, action: PayloadAction<{ name: keyof SeldonState; value: string | number }>) => {
      const { name, value } = action.payload;
      (state[name] as string | number) = value;
    },
    handleKnowledgebase: (state, action: PayloadAction<string>) => {
      const itemIndex = state.knowledgebase.indexOf(action.payload);

      if (itemIndex === -1) {
        // Item not found, add it
        state.knowledgebase.push(action.payload);
      } else {
        // Item found, remove it only if there's more than 1 item selected
        if (state.knowledgebase.length > 1) {
          state.knowledgebase.splice(itemIndex, 1);
        }
      }
    },
    resetSeldonState: (state) => {
      return {
        ...initialState,
        question: state.question,
      };
    },
    resetSeldonProperty: (state, action: PayloadAction<keyof SeldonState>) => {
      const propertyToReset = action.payload;
      if (propertyToReset === 'knowledgebase') {
        state[propertyToReset] = [];
      } else {
        (state[propertyToReset] as string | number) = initialState[propertyToReset]; // Reset the specific property to its initial value
      }
    },
  },
});

export const { handleSeldonInput, handleKnowledgebase, resetSeldonState, resetSeldonProperty } = seldonSlice.actions;

export default seldonSlice.reducer;

export const getSeldonState = (state: any) => state.seldon;
