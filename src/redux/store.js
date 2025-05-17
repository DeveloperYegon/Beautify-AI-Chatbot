// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice"; // Import reducer
import threadReducer from "./threadSlice";
import chatReducer from "./chatSlice";
import userReducer from "./userSlice";


const persistConfig = {
  key: "root",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);


export const store = configureStore({
  reducer: {
    auth: authReducer, // Add reducers here
    thread: threadReducer,
    chat: chatReducer,
    user: userReducer,  
    auth: persistedAuthReducer,
  },
});
export const persistor = persistStore(store);
export default store;
