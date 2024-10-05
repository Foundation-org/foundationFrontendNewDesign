import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  guestSignUpDialogue: false,
  isTriggeredFrom: '',
  signupTriggeredFrom: '',
  guestSignInDialogue: false,
  credentialLogin: false,
  credentialRegister: false,
};

export const extrasSlice = createSlice({
  name: 'extras',
  initialState,
  reducers: {
    setGuestSignUpDialogue: (state, action) => {
      const { isSignup, isTriggeredFrom } = action.payload;
      state.guestSignInDialogue = false;
      state.credentialLogin = false;
      state.guestSignUpDialogue = isSignup;
      if (isSignup) {
        state.isTriggeredFrom = isTriggeredFrom;
      } else {
        state.signupTriggeredFrom = '';
      }
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
    setSignupTriggeredFrom: (state, action) => {
      state.signupTriggeredFrom = action.payload;
    },
  },
});

export const { setGuestSignUpDialogue, setGuestSignInDialogue, setCredentialLogin, setCredentialRegister } =
  extrasSlice.actions;

export default extrasSlice.reducer;
