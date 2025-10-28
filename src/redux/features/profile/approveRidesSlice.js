import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../../utils/Client";

const apiUrl =import.meta.env.VITE_API_URL;

// Async thunk to update booking status
export const updateBookingStatus = createAsyncThunk(
  "approveRides/updateBookingStatus",
  async ({ rideId, bookingId, status }, { rejectWithValue }) => {
    try {
      await axiosClient.post(`${apiUrl}/approve_rides`, {
        rideId,
        bookingId,
        status,
      });
      // Return the updated info so we can update store locally
      return { rideId, bookingId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Network error");
    }
  }
);


const approveRidesSlice = createSlice({
  name: "approveRides",
  initialState: { status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateBookingStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBookingStatus.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default approveRidesSlice.reducer;
