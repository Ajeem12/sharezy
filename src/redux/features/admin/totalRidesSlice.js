// src/store/slices/totalRidesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const apiUrl =import.meta.env.VITE_API_URL;

// Async thunk for fetching rides data
export const fetchRidesData = createAsyncThunk(
  'rides/fetchRidesData',
  async (_, { getState }) => {
    // Get the token from localStorage (or from Redux state if you're storing it there)
    const token = localStorage.getItem('admintoken');  // Replace with your token storage method
    
    // Send the token in the Authorization header as a Bearer token
    const response = await axios.get(`${apiUrl}/all_publish_rides`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  }
);

const totalRidesSlice = createSlice({
  name: 'totalRides',
  initialState: {
    rides: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRidesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRidesData.fulfilled, (state, action) => {
        state.loading = false;
        state.rides = action.payload;
      })
      .addCase(fetchRidesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default totalRidesSlice.reducer;
