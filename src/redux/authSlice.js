import { createSlice } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
  user: null, // Holds user details
  token: localStorage.getItem("authToken") || null, // Store token
  isAuthenticated: !!localStorage.getItem("authToken"), // Boolean flag
};

// Create a slice of Redux state
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("authToken", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authToken");
    },
  },
});

// Export actions
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
