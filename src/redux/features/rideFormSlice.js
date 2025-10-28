// src/features/rideForm/rideFormSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  from: null,
  to: null,
  date: '',
  passengers: 1,
};

const rideFormSlice = createSlice({
  name: 'rideForm',
  initialState,
  reducers: {
    setFrom(state, action) {
      state.from = action.payload;
    },
    setTo(state, action) {
      state.to = action.payload;
    },
    setDate(state, action) {
      state.date = action.payload;
    },
    setPassengers(state, action) {
      state.passengers = action.payload;
    },
    swapLocations(state) {
      const temp = state.from;
      state.from = state.to;
      state.to = temp;
    },
    resetForm(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setFrom, setTo, setDate, setPassengers, swapLocations, resetForm } = rideFormSlice.actions;

export default rideFormSlice.reducer;
