import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  yesNo: {
    yes: {
      check: false,
      contend: false,
    },
    no: {
      check: false,
      contend: false,
    },
  },
  agreeDisagree: {
    agree: {
      check: false,
      contend: false,
    },
    disagree: {
      check: false, 
      contend: false,
    },
  },
};


export const questsSlice = createSlice({
  name: "quests",
  initialState,
  reducers: {
    toggleCheck: (state, action) => {
      const { option, check, contend } = action.payload;

      if (option === "Yes") {
        if (check) {
          state["yesNo"]["yes"].check = true;
          state["yesNo"]["yes"].contend = false;
          state["yesNo"]["no"].check = false;
        } else if (contend) {
          state["yesNo"]["yes"].check = false;
          state["yesNo"]["yes"].contend = true;
          state["yesNo"]["no"].contend = false;
        }
      }

      if (option === "No") {
        if (check) {
          state["yesNo"]["no"].check = true;
          state["yesNo"]["no"].contend = false;
          state["yesNo"]["yes"].check = false;
        } else if (contend) {
          state["yesNo"]["no"].check = false;
          state["yesNo"]["no"].contend = true;
          state["yesNo"]["yes"].contend = false;
        }
      }
      if (option === "Agree") {
        if (check) {
          state["agreeDisagree"]["agree"].check = true;
          state["agreeDisagree"]["agree"].contend = false;
          state["agreeDisagree"]["disagree"].check = false;
        } else if (contend) {
          state["agreeDisagree"]["agree"].check = false;
          state["agreeDisagree"]["agree"].contend = true;
          state["agreeDisagree"]["disagree"].contend = false;
        }
      }
      if (option === "Disagree") {
        if (check) {
          state["agreeDisagree"]["disagree"].check = true;
          state["agreeDisagree"]["disagree"].contend = false;
          state["agreeDisagree"]["agree"].check = false;
        } else if (contend) {
          state["agreeDisagree"]["disagree"].check = false;
          state["agreeDisagree"]["disagree"].contend = true;
          state["agreeDisagree"]["agree"].contend = false;
        }
      }
    },
  },
});
    

export const { toggleCheck, togglecontend } = questsSlice.actions;

export default questsSlice.reducer;

export const getQuests = (state) => state.quests;
