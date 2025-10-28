import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosClient from '../../../utils/Client';

const apiUrl = import.meta.env.VITE_API_URL;

// 🚀 Thunk for regular commission report (no token)
export const commissionReport = createAsyncThunk(
  'commission/commissionReport',
  async (payload, thunkAPI) => {
    try {
      const response = await axiosClient.post(`${apiUrl}/commission_report`, payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch commission report'
      );
    }
  }
);

// ✅ Factory for admin-secured POST requests
export const adminPost = (type, endpoint) =>
  createAsyncThunk(type, async (payload, thunkAPI) => {
    try {
      const token = localStorage.getItem('admintoken');
      console.log(token);
      
      const response = await axios.post(`${apiUrl}/${endpoint}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Admin request failed'
      );
    }
  });

// In your commissionSlice.js or a related file
export const secureAdminCommission = adminPost(
  'commission/secureAdminCommission',
  'commission_report_admin' // ✅ matches your actual secured backend route
);


// 🚀 Thunk for updating commission (uses token)
export const commissionUpdate = createAsyncThunk(
  'commission/commissionUpdate',
  async (payload, thunkAPI) => {
    try {
      const token = localStorage.getItem('admintoken');
      const response = await axios.post(`${apiUrl}/commission_update`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update commission'
      );
    }
  }
);

// ✅ Initial state
const initialState = {
  report: null,
  updateResponse: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

// 🔧 Slice
const commissionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {
    clearCommissionState: (state) => {
      state.report = null;
      state.updateResponse = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Commission Report
    builder
      .addCase(commissionReport.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(commissionReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.report = action.payload;
      })
      .addCase(commissionReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Commission Update
    builder
      .addCase(commissionUpdate.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(commissionUpdate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.updateResponse = action.payload;
      })
      .addCase(commissionUpdate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Secure Admin Commission
    builder
      .addCase(secureAdminCommission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(secureAdminCommission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.report = action.payload;
      })
      .addCase(secureAdminCommission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// ✅ Exports
export const { clearCommissionState } = commissionSlice.actions;
export default commissionSlice.reducer;
