import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  guestSignUpDialogue: false,
};

export const extrasSlice = createSlice({
  name: 'extras',
  initialState,
  reducers: {
    setGuestSignUpDialogue: (state, action) => {
      state.guestSignUpDialogue = action.payload;
    },
  },
});

export const { setGuestSignUpDialogue } = extrasSlice.actions;

export default extrasSlice.reducer;
