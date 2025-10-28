import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for user registration

const apiUrl = import.meta.env.VITE_API_URL;


export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/registration`,userData);
      // Return response data (e.g. user info or success message)
      return response.data;
    } catch (error) {
      // Return custom error message if any
       return rejectWithValue(
        error.response?.data?.data?.mobile 
          ? error.response.data.data.mobile[0] 
          : error.response?.data?.data?.email 
            ? error.response.data.data.email[0] 
            : error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    error: null,
    success: false,   // to track registration success
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;  // registration succeeded
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
        state.success = false;
      });
  },
});

export const { resetState } = authSlice.actions;

export default authSlice.reducer;
