import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../utils/Client';
// ✅ Async thunk to send form data to the API

const apiUrl = import.meta.env.VITE_API_URL;

export const publishRide = createAsyncThunk(
  'publishForm/publishRide',
  async (rideData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`${apiUrl}/rides_entry`, rideData);
      
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


// ✅ Initial state
const initialState = {
  fromCity: '',       
  toCity: '',          
  date: '',
  time: '',
  seats: 1,
  vehicleNumber: '',
  vehicleName: '',        // newly added
  price: '',              // newly added
  remarks: '',
  rideShareEnabled: false,
  publishedRides: [],
  loading: false,
  error: null,
  success: false,
};

const publishFormSlice = createSlice({
  name: 'publishForm',
  initialState,
  reducers: {
    setFromCity(state, action) {
      state.fromCity = action.payload;
    },
    setToCity(state, action) {
      state.toCity = action.payload; 
    },
    setDate(state, action) {
      state.date = action.payload;
    },
    setTime(state, action) {
      state.time = action.payload;
    },
    setSeats(state, action) {
      state.seats = action.payload;
    },
    setVehicleNumber(state, action) {
      state.vehicleNumber = action.payload;
    },
    setVehicleName(state, action) {         // NEW
      state.vehicleName = action.payload;
    },
    setPrice(state, action) {               // NEW
      state.price = action.payload;
    },
    setRemarks(state, action) {
      state.remarks = action.payload;
    },
    toggleRideShare(state) {
      state.rideShareEnabled = !state.rideShareEnabled;
    },
    resetForm(state) {
      state.fromCity = null;
      state.toCity = null;
      state.date = '';
      state.time = '';
      state.seats = 1;
      state.vehicleNumber = '';
      state.vehicleName = '';
      state.price = '';
      state.remarks = '';
      state.rideShareEnabled = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishRide.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(publishRide.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.publishedRides.push(action.payload);
      })
      .addCase(publishRide.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to publish ride';
      });
  },
});

// ✅ Export actions
export const {
  setFromCity,
  setToCity,
  setDate,
  setTime,
  setSeats,
  setVehicleNumber,
  setVehicleName,     // NEW
  setPrice,           // NEW
  setRemarks,
  toggleRideShare,
  resetForm,
} = publishFormSlice.actions;

export default publishFormSlice.reducer;
