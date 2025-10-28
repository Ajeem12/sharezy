import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../utils/Client';

const apiUrl = import.meta.env.VITE_API_URL;

// Async thunk for confirming ride booking using axios
export const confirmRideBooking = createAsyncThunk(
  'rideBooking/confirmRideBooking',
  async (bookingData, thunkAPI) => {
    try {
      const response = await axiosClient.post(`${apiUrl}/book_ride`, bookingData);
      return response.data; // expected booking confirmation details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Booking failed'
      );
    }
  }
);

// Async thunk for fetching ride details using axios
export const getRideDetails = createAsyncThunk(
  'rideBooking/getRideDetails',
  async (rideId, thunkAPI) => {
    try {
      const response = await axiosClient.get(`${apiUrl}/rides_details/${rideId}`);
      console.log(`${apiUrl}/rides_details/${rideId}`);  // Check if URL is formed correctly
      return response.data; // expected ride details data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch ride details'
      );
    }
  }
);

const rideBookingSlice = createSlice({
  name: 'rideBooking',
  initialState: {
    loading: false,
    success: false,
    error: null,
    bookingDetails: null,
    rideDetails: null, // state for storing ride details
  },
  reducers: {
    resetRideBookingState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.bookingDetails = null;
      state.rideDetails = null; // Reset ride details
    },
  },
  extraReducers: (builder) => {
    builder
      // Confirm booking thunks (pending, fulfilled, rejected)
      .addCase(confirmRideBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(confirmRideBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bookingDetails = action.payload;
      })
      .addCase(confirmRideBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Get ride details thunks (pending, fulfilled, rejected)
      .addCase(getRideDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRideDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.rideDetails = action.payload; // Store fetched ride details in the state
      })
      .addCase(getRideDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error if fetching fails
      });
  },
});

// Export actions
export const { resetRideBookingState } = rideBookingSlice.actions;

export default rideBookingSlice.reducer;
