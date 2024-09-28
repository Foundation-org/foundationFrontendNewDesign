import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  guestSignUpDialogue: false,
  guestSignInDialogue: false,
  credentialLogin: false,
  credentialRegister: false,
};

export const extrasSlice = createSlice({
  name: 'extras',
  initialState,
  reducers: {
    setGuestSignUpDialogue: (state, action) => {
      state.guestSignInDialogue = false;
      state.credentialLogin = false;
      state.guestSignUpDialogue = action.payload;
    },
    setGuestSignInDialogue: (state, action) => {
      state.guestSignUpDialogue = false;
      state.credentialLogin = false;
      state.guestSignInDialogue = action.payload;
    },
    setCredentialLogin: (state, action) => {
      state.guestSignUpDialogue = false;
      state.credentialLogin = action.payload;
    },
    setCredentialRegister: (state, action) => {
      state.guestSignInDialogue = false;
      state.credentialRegister = action.payload;
    },
  },
});

export const { setGuestSignUpDialogue, setGuestSignInDialogue, setCredentialLogin, setCredentialRegister } =
  extrasSlice.actions;

export default extrasSlice.reducer;
