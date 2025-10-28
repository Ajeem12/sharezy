import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../utils/Client";

const apiUrl = import.meta.env.VITE_API_URL;

// Async thunk for fetching bookings (GET method)
export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`${apiUrl}/my_booked_rides`); // ⬅️ Changed to GET
      return response.data; // Expected to be an array of bookings
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetching bookings failed"
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async ({ bookingId, reason, status = 0 }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`${apiUrl}/cancel_rides`, {
        booking_id: bookingId,
        cancel_reason: reason || "",
        status,
      });
      return { bookingId, status, reason, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    status: "idle",
    error: null,
    cancelStatus: "idle",
    cancelError: null,
  },
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.cancelStatus = "loading";
        state.cancelError = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.cancelStatus = "succeeded";
        const { bookingId, status, reason } = action.payload;

        const bookingIndex = state.bookings.findIndex(
          (b) => b.id === bookingId
        );
        if (bookingIndex !== -1) {
          state.bookings[bookingIndex].status = status; 
          state.bookings[bookingIndex].cancel_reason = reason;
        }
      })

      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancelStatus = "failed";
        state.cancelError = action.payload;
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
