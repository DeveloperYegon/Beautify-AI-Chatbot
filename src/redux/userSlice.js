// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_KEY;

// Async action to fetch user data
export const fetchUser = createAsyncThunk("user/fetchUser", async (userId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${apiUrl}:5001/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("User data fetched:", response.data);
    
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error fetching user data");
  }
});

// Async action to update user data
export const updateUser = createAsyncThunk("user/updateUser", async (userData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("authToken");
    await axios.put(`${apiUrl}:5001/api/users/${userData.userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return userData;

  } catch (error) {
    return rejectWithValue(error.response?.data || "Error updating profile");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.data = null;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
