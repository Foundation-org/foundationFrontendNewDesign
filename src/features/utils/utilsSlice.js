import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
};

export const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    changeTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { changeTheme } = utilsSlice.actions;

export default utilsSlice.reducer;
