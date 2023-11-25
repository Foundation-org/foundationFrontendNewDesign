import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  yesNo: {
    yes: {
      check: false,
      content: false,
    },
    no: {
      check: false,
      content: false,
    },
  },
};

export const questsSlice = createSlice({
  name: "quests",
  initialState,
  reducers: {
    toggleCheck: (state, action) => {
      const { option, check, content } = action.payload;

      if (option === "Yes") {
        if (check) {
          state["yesNo"]["yes"].check = true;
          state["yesNo"]["yes"].content = false;
          state["yesNo"]["no"].check = false;
        } else if (content) {
          state["yesNo"]["yes"].check = false;
          state["yesNo"]["yes"].content = true;
          state["yesNo"]["no"].content = false;
        }
      }

      if (option === "No") {
        if (check) {
          state["yesNo"]["no"].check = true;
          state["yesNo"]["no"].content = false;
          state["yesNo"]["yes"].check = false;
        } else if (content) {
          state["yesNo"]["no"].check = false;
          state["yesNo"]["no"].content = true;
          state["yesNo"]["yes"].content = false;
        }
      }
    },
  },
});

export const { toggleCheck, toggleContent } = questsSlice.actions;

export default questsSlice.reducer;

export const getQuests = (state) => state.quests.yesNo;
