import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const apiUrl = import.meta.env.VITE_API_URL;

export const fetchMostVisitedRides = createAsyncThunk(
  'mostVisited/fetchMostVisitedRides',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/where_want_to_go`);
       
      return response.data; // Must return an array of rides
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch most visited rides');
    }
  }
);

const initialState = {
  destinations: [],
  status: 'idle',
  error: null,
};

const mostVisitedSlice = createSlice({
  name: 'mostVisited',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMostVisitedRides.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMostVisitedRides.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.destinations = action.payload;
      })
      .addCase(fetchMostVisitedRides.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const getMostVisited = (state) => state.mostVisited.destinations;
export const getMostVisitedStatus = (state) => state.mostVisited.status;
export const getMostVisitedError = (state) => state.mostVisited.error;

export default mostVisitedSlice.reducer;
