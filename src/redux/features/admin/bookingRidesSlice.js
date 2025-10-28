
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Async thunk to fetch booking rides count
export const fetchBookingRidesCount = createAsyncThunk(
  "bookingRides/fetchCount",
  async (_, { rejectWithValue }) => {
    try {
           const token = localStorage.getItem("admintoken");
      const response = await axios.get(`${apiUrl}/booking_rides_count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data;  // returning count directly
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch rides count");
    }
  }
);

const bookingRidesSlice = createSlice({
  name: "bookingRides",
  initialState: {
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingRidesCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingRidesCount.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload;
      })
      .addCase(fetchBookingRidesCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingRidesSlice.reducer;
