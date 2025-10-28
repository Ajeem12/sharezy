import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import  axiosClient from '../../utils/Client'

// Async thunk to search rides with POST
export const searchRides = createAsyncThunk(
  "search/searchRides",
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/serach_rides", searchParams);
      return response.data; // expecting rides data from backend
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    rides: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearSearchResults(state) {
      state.rides = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRides.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchRides.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rides = action.payload;
      })
      .addCase(searchRides.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch rides";
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
