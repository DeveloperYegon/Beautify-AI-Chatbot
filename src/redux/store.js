import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Import reducer
import threadReducer from "./threadSlice";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Add reducers here
    thread: threadReducer,
    chat: chatReducer,
  },
});

export default store;
