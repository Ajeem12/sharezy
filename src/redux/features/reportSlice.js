// features/report/reportSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../utils/Client';

// POST with raw value, not as an object with a key
const apiUrl = import.meta.env.VITE_API_URL;

export const submitReport = createAsyncThunk(
  'report/submitReport',
  async ({ report, bookingId }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post('/report_users_ride', {
      remarks: report,
      booking_id: bookingId,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to submit report');
  }
}
);

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetReportState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReport.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitReport.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReportState } = reportSlice.actions;
export default reportSlice.reducer;
