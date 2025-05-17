// src/redux/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  threadId: null,
  messages: [],
  status: 'idle',
  error: null
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setThreadId: (state, action) => {
      state.threadId = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearChat: (state) => {
      state.threadId = null;
      state.messages = [];
    }
  },
});

export const { setThreadId,setMessages, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;

//Selectors
export const selectCurrentThreadId = (state) => state.chat.threadId;
export const selectMessages = (state) => state.chat.messages;