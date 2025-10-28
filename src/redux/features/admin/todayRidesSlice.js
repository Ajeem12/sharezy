// src/redux/features/admin/todayRidesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Async thunk to fetch today's rides
export const fetchTodayRides = createAsyncThunk(
  'todayRides/fetchTodayRides',
  async (_, thunkAPI) => {
    try {
      // Assuming you have admin token in localStorage
      const token = localStorage.getItem('admintoken');
      const response = await axios.get(`${apiUrl}/todays_publish_Rides`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // assume this returns an array of rides
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch today rides'
      );
    }
  }
);

const todayRidesSlice = createSlice({
  name: 'todayRides',
  initialState: {
    rides: [],
    status: 'idle',  // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearTodayRidesState: (state) => {
      state.rides = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayRides.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodayRides.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rides = action.payload;
      })
      .addCase(fetchTodayRides.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearTodayRidesState } = todayRidesSlice.actions;
export default todayRidesSlice.reducer;
