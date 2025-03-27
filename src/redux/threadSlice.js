import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  threadId: localStorage.getItem("chatID") || null,  // Load from storage if available
};

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    setThreadId: (state, action) => {
      state.threadId = action.payload;
      localStorage.setItem("chatID", action.payload); // Persist in localStorage
    },
    clearThreadId: (state) => {
      state.threadId = null;
      localStorage.removeItem("chatID");
    },
  },
});

export const { setThreadId, clearThreadId } = threadSlice.actions;
export default threadSlice.reducer;
