import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../../utils/Client";
import { updateBookingStatus } from "../profile/approveRidesSlice";

const apiUrl = import.meta.env.VITE_API_URL;

// FETCH USER RIDES
export const fetchUserRides = createAsyncThunk(
  "usersRides/fetchUserRides",
  async (_, thunkAPI) => {
    try {
      const response = await axiosClient.post(`${apiUrl}/users_rides`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// CANCEL RIDE
export const cancelRide = createAsyncThunk(
  "usersRides/cancelRide",
  async ({ ride_id, status }, thunkAPI) => {
    try {
      const response = await axiosClient.post(`${apiUrl}/rides_status_change`, {
        ride_id,
        status,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// UPDATE (EDIT) RIDE
export const updateRide = createAsyncThunk(
  "usersRides/updateRide",
  async ({ rideId, updatedData }, thunkAPI) => {
    try {
      const response = await axiosClient.post(
        `${apiUrl}/update_rides/${rideId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ START RIDE
export const startRide = createAsyncThunk(
  "usersRides/startRide",
  async (rideId, thunkAPI) => {
    try {
      const response = await axiosClient.post(`${apiUrl}/ride_start/${rideId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyOtpBooking = createAsyncThunk(
  "usersRides/verifyOtpBooking",
  async ({ array, rideId }, thunkAPI) => {
    try {
      const response = await axiosClient.post(`/verify_otp_booking/${rideId}`, {
        array_var: array,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const usersRidesSlice = createSlice({
  name: "usersRides",
  initialState: {
    rides: [],
    status: "idle",
    error: null,
    cancelStatus: "idle",
    updateStatus: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH RIDES
      .addCase(fetchUserRides.pending, (state) => {
        state.status = "loading";
        state.rides = [];
        state.error = null;
      })
      .addCase(fetchUserRides.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rides = action.payload;
      })
      .addCase(fetchUserRides.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // CANCEL RIDE
      .addCase(cancelRide.pending, (state) => {
        state.cancelStatus = "loading";
      })
      .addCase(cancelRide.fulfilled, (state, action) => {
        const updatedRide = action.payload;
        state.cancelStatus = "succeeded";
        state.rides = state.rides.map((ride) =>
          ride.id === updatedRide.id ? updatedRide : ride
        );
      })
      .addCase(cancelRide.rejected, (state, action) => {
        state.cancelStatus = "failed";
        state.error = action.payload;
      })

      // UPDATE RIDE
      .addCase(updateRide.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateRide.fulfilled, (state, action) => {
        const updatedRide = action.payload;
        state.updateStatus = "succeeded";
        state.rides = state.rides.map((ride) =>
          ride.id === updatedRide.id ? updatedRide : ride
        );
      })
      .addCase(updateRide.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      })

      //  START RIDE
      .addCase(startRide.pending, (state) => {
        state.status = "loading";
      })
      .addCase(startRide.fulfilled, (state, action) => {
        const startedRide = action.payload;
        state.status = "succeeded";
        state.rides = state.rides.map((ride) =>
          ride.id === startedRide.id ? startedRide : ride
        );
      })
      .addCase(startRide.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      //after verify loading or error state(optional)
      .addCase(verifyOtpBooking.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyOtpBooking.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(verifyOtpBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update booking status from another slice
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const { rideId, bookingId, status } = action.payload;
        state.rides = state.rides.map((ride) => {
          if (ride.id === rideId) {
            return {
              ...ride,
              booked_rides: ride.booked_rides.map((booking) =>
                booking.id === bookingId ? { ...booking, status } : booking
              ),
            };
          }
          return ride;
        });
      });
  },
});

export default usersRidesSlice.reducer;
